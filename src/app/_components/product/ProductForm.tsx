'use client';

/**
 * Renders a product form component.
 *
 * @example
 * <ProductForm />
 */

import { useState } from 'react';

import { api } from '@/trpc/react';
import InputField from '../ui/InputField';
import Button from '../ui/Button';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';

const SIZES = {
  CLOTH: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
  SHOE: [
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '50',
  ],
};

const COLORS = [
  'white',
  'black',
  'gray',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
];

interface InventoryItem {
  name: string;
  colors: {
    name: string;
    stock: number;
  }[];
}

export default function ProductForm() {
  const utils = api.useUtils();

  const [formMessage, setFormMessage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [onSalePrice, setOnSalePrice] = useState(0);
  const [image, setImage] = useState<string>();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const createProduct = api.product.create.useMutation({
    onError: () => {
      setFormMessage('Something went wrong. Please try again.');
      setTimeout(() => {
        setFormMessage('');
      }, 5000);
    },
    onSuccess: async () => {
      await utils.product.invalidate();
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];

    if (selectedFile) {
      setFormMessage('');
      // Validate file type and size
      const isValidFileType = checkFileType(selectedFile);
      if (!isValidFileType) {
        setFormMessage('Please upload a valid image file');
        return;
      }
      const isValidFileSize = checkFileSize(selectedFile);
      if (!isValidFileSize) {
        setFormMessage('Please upload a file smaller than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target!.result;
        setImage(imageData as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setFormMessage('');
    e.preventDefault();

    createProduct.mutate({ name, description, basePrice, onSalePrice, image, inventory });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
      <InputField
        name="name"
        type="text"
        placeholder="Name"
        handleValueChange={(value: string) => setName(value)}
        required
      />
      <InputField
        name="description"
        type="text"
        placeholder="Description"
        required
        handleValueChange={(value: string) => setDescription(value)}
      />
      <InputField
        name="basePrice"
        type="number"
        placeholder="Base Price"
        required
        handleValueChange={(value: string) => setBasePrice(Number(value))}
      />
      <InputField
        name="onSalePrice"
        type="number"
        placeholder="On Sale Price"
        required
        handleValueChange={(value: string) => setOnSalePrice(Number(value))}
      />
      <select
        onChange={(e) => {
          const selectedSizes = Array.from(e.target.selectedOptions, (option) => option.value);
          setInventory(
            selectedSizes.map((name) => ({
              name,
              colors: [],
            }))
          );
        }}
        name="size"
        className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
        multiple
        required>
        <option value="" disabled>
          Cloth Sizes
        </option>
        {SIZES.CLOTH.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
        <option value="" disabled>
          Shoe Sizes
        </option>
        {SIZES.SHOE.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      {/* If there are sizes, render a selection of colors for each size */}
      {inventory &&
        inventory.length > 0 &&
        inventory.map((sizeObj, index) => (
          <div key={sizeObj.name} className="flex flex-col gap-2">
            <p>{sizeObj.name}</p>
            <select
              onChange={(e) => {
                const selectedColors = Array.from(e.target.selectedOptions, (option) => option.value);
                setInventory((prevInventory) => {
                  const updatedInventory = [...prevInventory];

                  if (updatedInventory[index]) {
                    updatedInventory[index].colors = selectedColors.map((color) => ({ name: color, stock: 0 }));
                  }
                  return updatedInventory;
                });
              }}
              name="color"
              className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
              multiple
              required>
              {COLORS.map((color) => (
                <option key={color} value={color}>
                  <span
                    className={`mr-2 inline-block h-4 w-4 rounded-full border border-slate-800/50 ${color === 'black' ? 'bg-black' : color === 'white' ? 'bg-white' : `bg-${color}-500`} `}></span>
                  <span>{color}</span>
                </option>
              ))}
            </select>
            {/* If there are colors for the selected size, require a stock amount for each color */}
            {sizeObj.colors && sizeObj.colors.length > 0 && (
              <div className="flex flex-col gap-2">
                <p>{sizeObj.name} Color Stock</p>
                {sizeObj.colors.map((colorObj, colorIndex) => (
                  <div key={colorObj.name} className="flex items-center gap-2">
                    <span
                      className={`mr-2 inline-block h-4 w-4 rounded-full border border-slate-800/50 ${colorObj.name === 'black' ? 'bg-black' : colorObj.name === 'white' ? 'bg-white' : `bg-${colorObj.name}-500`} `}></span>
                    <input
                      name="stock"
                      type="number"
                      placeholder="Stock"
                      required
                      value={colorObj.stock}
                      className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
                      onChange={(e) => {
                        setInventory((prevInventory) => {
                          const updatedInventory = [...prevInventory];
                          if (updatedInventory[index]?.colors[colorIndex]) {
                            updatedInventory[index].colors[colorIndex].stock = Number(e.target.value);
                          }
                          return updatedInventory;
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      <input
        className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
        type="file"
        name="image"
        accept="image/png, image/jpeg, image/jpg"
        onChange={(e) => handleImage(e)}
      />
      <Button type="submit" disabled={createProduct.isPending}>
        {createProduct.isPending ? 'Submitting...' : 'Submit'}
      </Button>
      {formMessage && <p className="m-auto text-red-500">{formMessage}</p>}
    </form>
  );
}
