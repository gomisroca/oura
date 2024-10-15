'use client';

/**
 * Renders a product update form component.
 *
 * @example
 * <ProductUpdate />
 */

import { useEffect, useState } from 'react';

import { api } from '@/trpc/react';
import Button from '@/app/_components/ui/Button';
import Spinner from '@/app/_components/ui/Spinner';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';
import { env } from '@/env';
import Image from 'next/image';

interface Category {
  name: string;
  subcategory?: Category[];
  id: number;
}

interface InventoryItem {
  name: string;
  colors: {
    name: string;
    stock: number;
  }[];
}

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

function Color({ color }: { color: string }) {
  return (
    <span
      className={`h-4 w-4 rounded-full border border-slate-800 shadow-md transition duration-200 ease-in-out dark:border-slate-200 ${color === 'black' ? 'bg-black' : color === 'white' ? 'bg-white' : `bg-${color}-500`}`}></span>
  );
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
          <Color color={colorObj.name} />
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
              <option
                key={color}
                value={color}
                className="flex flex-row items-center gap-2"
                selected={sizeObj.colors.some((c) => c.name === color)}>
                <Color color={color} />
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
          <option key={size} value={size} selected={inventory.some((s) => s.name === size)}>
            {size}
          </option>
        ))}
        <option value="" disabled>
          Shoe Sizes
        </option>
        {SIZES.SHOE.map((size) => (
          <option key={size} value={size} selected={inventory.some((s) => s.name === size)}>
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
  productCategory,
  productSubcategory,
}: {
  category: Category;
  setSubcategory: React.Dispatch<React.SetStateAction<number>>;
  productCategory?: { id: number; name: string };
  productSubcategory?: { id: number; name: string };
}) {
  const { data: subcategories, status } = api.category.getSubcategories.useQuery({ categoryId: Number(category.id) });
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category>();

  return status === 'pending' ? (
    <Spinner />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch subcategories at this time" />
  ) : (
    <>
      <p>{category.name} Subcategories</p>
      <select
        name="subcategory"
        className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setSelectedSubcategory({ name: selectedOption.text, id: Number(selectedOption.value) });
          setSubcategory(Number(selectedOption.value));
        }}>
        {productSubcategory && category.id === productCategory?.id ? (
          <option value={productSubcategory.id} selected>
            {productSubcategory.name}
          </option>
        ) : (
          <option value="" disabled selected={!selectedSubcategory}>
            Select Subcategory
          </option>
        )}
        {subcategories
          ?.filter((c) => c.id !== productSubcategory?.id)
          .map((subcategory) => (
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
  setCategory,
  productSport,
  productCategory,
  productSubcategory,
}: {
  sport: Category;
  setSubcategory: React.Dispatch<React.SetStateAction<number>>;
  setCategory: React.Dispatch<React.SetStateAction<number>>;
  productSport?: { id: number; name: string };
  productCategory?: { id: number; name: string };
  productSubcategory?: { id: number; name: string };
}) {
  const { data: categories, status } = api.category.getCategories.useQuery({ sportId: Number(sport.id) });

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  return status === 'pending' ? (
    <Spinner />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch categories at this time" />
  ) : (
    <>
      <p>{sport.name} Categories</p>
      <select
        name="category"
        className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setCategory(Number(selectedOption.value));
          setSelectedCategory({ name: selectedOption.text, id: Number(selectedOption.value) });
        }}>
        {productCategory && sport.id === productSport?.id ? (
          <option value={productCategory.id} selected>
            {productCategory.name}
          </option>
        ) : (
          <option value="" disabled selected={!selectedCategory}>
            Select Category
          </option>
        )}
        {categories
          .filter((c) => c.id !== productCategory?.id)
          .map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
      </select>
      {selectedCategory && (
        <SubcategorySelection
          key={selectedCategory.id}
          category={selectedCategory}
          setSubcategory={setSubcategory}
          productSubcategory={productSubcategory}
        />
      )}
    </>
  );
}

function SportSelection({
  setSubcategory,
  setCategory,
  setSport,
  productSport,
  productCategory,
  productSubcategory,
}: {
  setSubcategory: React.Dispatch<React.SetStateAction<number>>;
  setCategory: React.Dispatch<React.SetStateAction<number>>;
  setSport: React.Dispatch<React.SetStateAction<number>>;
  productSport?: { id: number; name: string };
  productCategory?: { id: number; name: string };
  productSubcategory?: { id: number; name: string };
}) {
  const { data: sports, status } = api.category.getSports.useQuery();
  const [selectedSport, setSelectedSport] = useState<Category>();

  return status === 'pending' ? (
    <Spinner />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch sports at this time" />
  ) : (
    <>
      <h1 className="text-xl">Sport Selection</h1>
      <select
        name="sport"
        className="w-full rounded-lg bg-slate-300 px-4 py-2 dark:bg-slate-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setSport(Number(selectedOption.value));
          setSelectedSport({ name: selectedOption.text, id: Number(selectedOption.value) });
        }}>
        {productSport ? (
          <option value={productSport.id} selected>
            {productSport.name}
          </option>
        ) : (
          <option value="" disabled selected={!selectedSport}>
            Select Sport
          </option>
        )}
        {sports
          .filter((s) => s.id !== productSport?.id)
          .map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
      </select>
      {selectedSport && (
        <CategorySelection
          key={selectedSport.id}
          sport={selectedSport}
          setSubcategory={setSubcategory}
          setCategory={setCategory}
          productSport={productSport}
          productCategory={productCategory}
          productSubcategory={productSubcategory}
        />
      )}
    </>
  );
}

function GenderSelection({
  setGender,
  productGenders,
}: {
  setGender: React.Dispatch<React.SetStateAction<('MALE' | 'FEMALE' | 'OTHER')[]>>;
  productGenders: ('MALE' | 'FEMALE' | 'OTHER')[];
}) {
  return (
    <>
      <h1 className="text-xl">Gender Selection</h1>
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
          <option key={gender} value={gender} selected={productGenders.includes(gender as 'MALE' | 'FEMALE' | 'OTHER')}>
            {gender}
          </option>
        ))}
      </select>
    </>
  );
}

export default function ProductUpdate({ productId }: { productId: string }) {
  const utils = api.useUtils();
  const { data: product } = api.product.getUnique.useQuery(productId);

  const [formMessage, setFormMessage] = useState({ error: true, message: '' });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [onSalePrice, setOnSalePrice] = useState(0);
  const [image, setImage] = useState<string>();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [subcategory, setSubcategory] = useState<number>(0);
  const [category, setCategory] = useState<number>(0);
  const [sport, setSport] = useState<number>(0);
  const [gender, setGender] = useState<('MALE' | 'FEMALE' | 'OTHER')[]>([]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setBasePrice(product.basePrice);
      setOnSalePrice(product.onSalePrice);
      setGender(product.gender);
      setSubcategory(product.subcategory?.id ?? 0);
      setCategory(product.category?.id ?? 0);
      setSport(product.sport?.id ?? 0);
      setInventory(product.sizes.map((size) => ({ name: size.name, colors: size.colors })));
    }
  }, [product]);

  const updateProduct = api.product.update.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.product.invalidate();
      setFormMessage({ error: false, message: 'Product updated successfully!' });
    },
  });

  const deleteProduct = api.product.delete.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.product.invalidate();
      setFormMessage({ error: false, message: 'Product deleted successfully!' });
    },
  });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files![0];

    if (selectedFile) {
      setFormMessage({ error: false, message: '' });
      // Validate file type and size
      const isValidFileType = checkFileType(selectedFile);
      if (!isValidFileType) {
        setFormMessage({ error: true, message: 'Please upload a valid image file' });
        return;
      }
      const isValidFileSize = checkFileSize(selectedFile);
      if (!isValidFileSize) {
        setFormMessage({ error: true, message: 'Please upload a file smaller than 2MB' });
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
    setFormMessage({ error: false, message: '' });
    e.preventDefault();

    updateProduct.mutate({
      id: productId,
      name,
      description,
      basePrice,
      onSalePrice,
      gender,
      subcategory,
      category,
      sport,
      inventory,
      image,
    });
  };

  if (product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          className="bg-red-500/80 dark:bg-red-600 xl:bg-red-500/80 xl:dark:bg-red-600/80"
          onClick={() => deleteProduct.mutate({ id: productId })}>
          Delete Product
        </Button>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="description"
            type="text"
            placeholder="Description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="basePrice"
            type="number"
            placeholder="Base Price"
            required
            min={0}
            step={0.01}
            value={basePrice}
            onChange={(e) => setBasePrice(Number(e.target.value))}
          />
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="onSalePrice"
            type="number"
            placeholder="On Sale Price"
            required
            min={0}
            step={0.01}
            value={onSalePrice}
            onChange={(e) => setOnSalePrice(Number(e.target.value))}
          />
          <GenderSelection setGender={setGender} productGenders={gender} />
          <SportSelection
            setSubcategory={setSubcategory}
            setCategory={setCategory}
            setSport={setSport}
            productSport={product?.sport ?? undefined}
            productCategory={product?.category ?? undefined}
            productSubcategory={product?.subcategory ?? undefined}
          />
          <h1 className="text-xl">Size Selection</h1>
          <SizeSelection inventory={inventory} setInventory={setInventory} />
          {product.image ? (
            <Image
              src={`https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.image}`}
              alt={name}
              width={200}
              height={250}
            />
          ) : (
            <p>No image uploaded</p>
          )}
          <p>New Image (optional)</p>
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            onChange={(e) => handleImage(e)}
          />
          <Button type="submit">Submit</Button>
          {formMessage.message && <MessageWrapper error={formMessage.error} message={formMessage.message} />}
        </form>
      </div>
    );
  }
}
