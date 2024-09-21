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
import ColorBubble from '../ui/ColorBubble';

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

const GENDERS = ['MALE', 'FEMALE', 'OTHER'];

interface InventoryItem {
  name: string;
  colors: {
    name: string;
    stock: number;
  }[];
}

interface Category {
  name: string;
  subcategory?: Category[];
  id: string;
}

function StockInput({
  sizeObj,
  setInventory,
  index,
}: {
  sizeObj: InventoryItem;
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  index: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      <p>{sizeObj.name} Color Stock</p>
      {sizeObj.colors.map((colorObj, colorIndex) => (
        <div key={colorObj.name} className="flex items-center gap-2">
          <ColorBubble color={colorObj.name} />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            required
            min="0"
            step="1"
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
  );
}

function ColorSelection({
  inventory,
  setInventory,
}: {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}) {
  return (
    <>
      {inventory.map((sizeObj, index) => (
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
              <option key={color} value={color} className="flex flex-row items-center gap-2">
                <ColorBubble color={color} />
                <span>{color}</span>
              </option>
            ))}
          </select>
          {/* If there are colors for the selected size, require a stock amount for each color */}
          {sizeObj.colors && sizeObj.colors.length > 0 && (
            <StockInput sizeObj={sizeObj} setInventory={setInventory} index={index} />
          )}
        </div>
      ))}
    </>
  );
}

function SizeSelection({
  inventory,
  setInventory,
}: {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}) {
  return (
    <>
      {/* Multiselect for sizes */}
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
      {inventory && inventory.length > 0 && <ColorSelection inventory={inventory} setInventory={setInventory} />}
    </>
  );
}

function SubcategorySelection({
  category,
  setSubcategory,
}: {
  category: Category;
  setSubcategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  const subcategories = api.category.getSubcategories.useQuery({ categoryId: category.id });
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category>();

  return (
    <>
      <p>{category.name} Subcategories</p>
      <select
        name="subcategory"
        className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setSelectedSubcategory({ name: selectedOption.text, id: selectedOption.value });
          setSubcategory(selectedOption.value);
        }}>
        {subcategories.isLoading && (
          <option value="" disabled>
            Loading...
          </option>
        )}
        <option value="" disabled selected={!selectedSubcategory}>
          Select Subcategory
        </option>
        {subcategories.data?.map((subcategory) => (
          <option key={subcategory.id} value={subcategory.id}>
            {subcategory.name}
          </option>
        ))}
      </select>
    </>
  );
}

function CategorySelection({
  sport,
  setSubcategory,
}: {
  sport: Category;
  setSubcategory: React.Dispatch<React.SetStateAction<string>>;
}) {
  const categories = api.category.getCategories.useQuery({ sportId: sport.id });

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  return (
    <>
      <p>{sport.name} Categories</p>
      <select
        name="category"
        className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setSelectedCategory({ name: selectedOption.text, id: selectedOption.value });
        }}>
        {categories.isLoading && (
          <option value="" disabled>
            Loading...
          </option>
        )}
        <option value="" disabled selected={!selectedCategory}>
          Select Category
        </option>
        {categories.data?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {selectedCategory && (
        <SubcategorySelection key={selectedCategory.id} category={selectedCategory} setSubcategory={setSubcategory} />
      )}
    </>
  );
}

function SportSelection({ setSubcategory }: { setSubcategory: React.Dispatch<React.SetStateAction<string>> }) {
  const sports = api.category.getSports.useQuery();

  const [selectedSport, setSelectedSport] = useState<Category>();

  return (
    <>
      <p>Sport</p>
      <select
        name="sport"
        className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setSelectedSport({ name: selectedOption.text, id: selectedOption.value });
        }}>
        {sports.isLoading && (
          <option value="" disabled>
            Loading...
          </option>
        )}
        <option value="" disabled selected={!selectedSport}>
          Select Sport
        </option>
        {sports.data?.map((sport) => (
          <option key={sport.id} value={sport.id}>
            {sport.name}
          </option>
        ))}
      </select>
      {selectedSport && (
        <CategorySelection key={selectedSport.id} sport={selectedSport} setSubcategory={setSubcategory} />
      )}
    </>
  );
}

function GenderSelection({
  setGender,
}: {
  setGender: React.Dispatch<React.SetStateAction<('MALE' | 'FEMALE' | 'OTHER')[]>>;
}) {
  return (
    <>
      <p>Gender</p>
      <select
        name="gender"
        className="h-20 w-full overflow-hidden rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
        multiple
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions);
          const selectedGenders = selectedOptions
            .map((option) => option.value)
            .filter((value): value is 'MALE' | 'FEMALE' | 'OTHER' =>
              GENDERS.includes(value as 'MALE' | 'FEMALE' | 'OTHER')
            );
          setGender(selectedGenders);
        }}>
        {GENDERS.map((gender) => (
          <option key={gender} value={gender}>
            {gender}
          </option>
        ))}
      </select>
    </>
  );
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
  const [subcategory, setSubcategory] = useState<string>('');
  const [gender, setGender] = useState<('MALE' | 'FEMALE' | 'OTHER')[]>([]);

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

    createProduct.mutate({ name, description, basePrice, onSalePrice, gender, subcategory, inventory, image });
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
        min={0}
        step={0.01}
        handleValueChange={(value: string) => setBasePrice(Number(value))}
      />
      <InputField
        name="onSalePrice"
        type="number"
        placeholder="On Sale Price"
        required
        min={0}
        step={0.01}
        handleValueChange={(value: string) => setOnSalePrice(Number(value))}
      />
      <GenderSelection setGender={setGender} />
      <SportSelection setSubcategory={setSubcategory} />
      <SizeSelection inventory={inventory} setInventory={setInventory} />
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
