'use client';

/**
 * Renders a product update form component.
 *
 * @example
 * <ProductUpdate />
 */

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import Spinner from '@/app/_components/ui/Spinner';
import { env } from '@/env';
import { api } from '@/trpc/react';
import { checkFileSize, checkFileType } from '@/utils/uploadChecks';

// Constants
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

const ERROR_MESSAGES = {
  FETCH_ERROR: 'Unable to fetch product details',
  UPDATE_ERROR: 'Failed to update product. Please try again.',
  DELETE_ERROR: 'Failed to delete product. Please try again.',
  IMAGE_UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  IMAGE_UPLOAD_SIZE_ERROR: 'Image size exceeds the limit of 2MB',
  IMAGE_UPLOAD_TYPE_ERROR: 'Please upload a valid image file',
  MISSING_REQUIRED: 'Please fill out all required fields.',
} as const;

// Types
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

interface ProductUpdateProps {
  productId: string;
}

interface FormMessage {
  error: boolean;
  message: string;
}

interface FormState {
  name: string;
  description: string;
  basePrice: number;
  onSalePrice: number;
  image?: string;
  inventory: InventoryItem[];
  subcategory: number;
  category: number;
  sport: number;
  gender: ('MALE' | 'FEMALE' | 'OTHER')[];
  isSubmitting: boolean;
  isDeleting: boolean;
  message: FormMessage | null;
}

const INITIAL_FORM_STATE: FormState = {
  name: '',
  description: '',
  basePrice: 0,
  onSalePrice: 0,
  image: undefined,
  inventory: [],
  subcategory: 0,
  category: 0,
  sport: 0,
  gender: [],
  isSubmitting: false,
  isDeleting: false,
  message: null,
};

function Color({ color }: { color: string }) {
  return (
    <span
      className={`h-4 w-4 rounded-sm border border-neutral-800 shadow-md transition duration-200 ease-in-out dark:border-neutral-200 ${color === 'black' ? 'bg-black' : color === 'white' ? 'bg-white' : `bg-${color}-500`}`}></span>
  );
}

function StockInput({
  sizeObj,
  setForm,
  index,
}: {
  sizeObj: InventoryItem;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
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
            className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
            onChange={(e) => {
              setForm((prev) => {
                const updatedInventory = [...prev.inventory];
                if (updatedInventory[index]?.colors[colorIndex]) {
                  updatedInventory[index].colors[colorIndex].stock = Number(e.target.value);
                }
                return { ...prev, inventory: updatedInventory };
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
  setForm,
}: {
  inventory: InventoryItem[];
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <>
      {inventory.map((sizeObj, index) => (
        <div key={sizeObj.name} className="flex flex-col gap-2">
          <p>{sizeObj.name}</p>
          <select
            onChange={(e) => {
              const selectedColors = Array.from(e.target.selectedOptions, (option) => option.value);
              setForm((prev) => {
                const updatedInventory = [...prev.inventory];

                if (updatedInventory[index]) {
                  updatedInventory[index].colors = selectedColors.map((color) => ({ name: color, stock: 0 }));
                }
                return { ...prev, inventory: updatedInventory };
              });
            }}
            name="color"
            className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
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
            <StockInput sizeObj={sizeObj} setForm={setForm} index={index} />
          )}
        </div>
      ))}
    </>
  );
}

function SizeSelection({
  inventory,
  setForm,
}: {
  inventory: InventoryItem[];
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <>
      {/* Multiselect for sizes */}
      <select
        onChange={(e) => {
          const selectedSizes = Array.from(e.target.selectedOptions, (option) => option.value);
          setForm((prev) => ({ ...prev, inventory: selectedSizes.map((name) => ({ name, colors: [] })) }));
        }}
        name="size"
        className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
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
      {inventory && inventory.length > 0 && <ColorSelection inventory={inventory} setForm={setForm} />}
    </>
  );
}

function SubcategorySelection({
  category,
  setForm,
  productSubcategory,
}: {
  category: Category;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  productCategory?: { id: number; name: string };
  productSubcategory?: { id: number; name: string };
}) {
  const { data: subcategories, status } = api.category.getAllSubcategories.useQuery({
    categoryId: Number(category.id),
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category | undefined>(productSubcategory);

  return status === 'pending' ? (
    <Spinner />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch subcategories at this time" />
  ) : (
    <>
      <p>{category.name} Subcategories</p>
      <select
        name="subcategory"
        className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setSelectedSubcategory({ name: selectedOption.text, id: Number(selectedOption.value) });
          setForm((prev) => ({ ...prev, subcategory: Number(selectedOption.value) }));
        }}>
        <option value="" disabled selected={!selectedSubcategory}>
          Select Subcategory
        </option>
        {subcategories.map((subcategory) => (
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
  setForm,
  productCategory,
  productSubcategory,
}: {
  sport: Category;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  productSport?: { id: number; name: string };
  productCategory?: { id: number; name: string };
  productSubcategory?: { id: number; name: string };
}) {
  const { data: categories, status } = api.category.getCategories.useQuery({ sportId: Number(sport.id) });

  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(productCategory);

  return status === 'pending' ? (
    <Spinner />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch categories at this time" />
  ) : (
    <>
      <p>{sport.name} Categories</p>
      <select
        name="category"
        className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setForm((prev) => ({ ...prev, category: Number(selectedOption.value) }));
          setSelectedCategory({ name: selectedOption.text, id: Number(selectedOption.value) });
        }}>
        <option value="" disabled selected={!selectedCategory}>
          Select Category
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {selectedCategory && (
        <SubcategorySelection
          key={selectedCategory.id}
          category={selectedCategory}
          setForm={setForm}
          productSubcategory={productSubcategory}
        />
      )}
    </>
  );
}

function SportSelection({
  setForm,
  productSport,
  productCategory,
  productSubcategory,
}: {
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  productSport?: { id: number; name: string };
  productCategory?: { id: number; name: string };
  productSubcategory?: { id: number; name: string };
}) {
  const { data: sports, status } = api.category.getSports.useQuery();
  const [selectedSport, setSelectedSport] = useState<Category | undefined>(productSport);

  return status === 'pending' ? (
    <Spinner />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch sports at this time" />
  ) : (
    <>
      <h1 className="text-xl">Sport Selection</h1>
      <select
        name="sport"
        className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setForm((prev) => ({ ...prev, sport: Number(selectedOption.value) }));
          setSelectedSport({ name: selectedOption.text, id: Number(selectedOption.value) });
        }}>
        <option value="" disabled selected={!selectedSport}>
          Select Sport
        </option>
        {sports.map((sport) => (
          <option key={sport.id} value={sport.id}>
            {sport.name}
          </option>
        ))}
      </select>
      {selectedSport && (
        <CategorySelection
          key={selectedSport.id}
          sport={selectedSport}
          setForm={setForm}
          productSport={productSport}
          productCategory={productCategory}
          productSubcategory={productSubcategory}
        />
      )}
    </>
  );
}

function GenderSelection({
  setForm,
  productGenders,
}: {
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  productGenders: ('MALE' | 'FEMALE' | 'OTHER')[];
}) {
  return (
    <>
      <h1 className="text-xl">Gender Selection</h1>
      <select
        name="gender"
        className="h-20 w-full overflow-hidden rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
        multiple
        onChange={(e) => {
          const selectedOptions = Array.from(e.target.selectedOptions);
          const selectedGenders = selectedOptions
            .map((option) => option.value)
            .filter((value): value is 'MALE' | 'FEMALE' | 'OTHER' =>
              GENDERS.includes(value as 'MALE' | 'FEMALE' | 'OTHER')
            );
          setForm((prev) => ({ ...prev, gender: selectedGenders }));
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

export default function ProductUpdate({ productId }: ProductUpdateProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Query for fetching category details
  const {
    data: product,
    error: fetchError,
    isLoading,
  } = api.product.getUnique.useQuery(productId, {
    retry: 2,
    enabled: Boolean(productId),
  });

  // Update mutation
  const updateProduct = api.product.update.useMutation({
    onMutate: () => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: true,
        message: null,
      }));
    },
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        message: {
          error: true,
          message: error.message || ERROR_MESSAGES.UPDATE_ERROR,
        },
      }));
    },
    onSuccess: async () => {
      await utils.category.invalidate();
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        message: {
          error: false,
          message: 'Product updated successfully!',
        },
      }));
    },
  });

  // Delete mutation
  const deleteProduct = api.product.delete.useMutation({
    onMutate: () => {
      setFormState((prev) => ({
        ...prev,
        isDeleting: true,
        message: null,
      }));
    },
    onError: (error) => {
      setFormState((prev) => ({
        ...prev,
        isDeleting: false,
        message: {
          error: true,
          message: error.message || ERROR_MESSAGES.DELETE_ERROR,
        },
      }));
    },
    onSuccess: async () => {
      await utils.category.invalidate();
      router.back();
      setFormState((prev) => ({
        ...prev,
        isDeleting: false,
        message: {
          error: false,
          message: 'Sport deleted successfully!',
        },
      }));
    },
  });

  // Set initial form data
  useEffect(() => {
    if (product) {
      setFormState((prev) => ({
        ...prev,
        name: product.name,
        description: product.description,
        basePrice: product.basePrice,
        onSalePrice: product.onSalePrice,
        gender: product.gender,
        inventory: product.sizes.map((size) => ({ name: size.name, colors: size.colors })),
        sport: product.sport?.id ?? 0,
        category: product.category?.id ?? 0,
        subcategory: product.subcategory?.id ?? 0,
      }));
    }
  }, [product]);

  // Form handlers
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const selectedFile = e.target.files![0];

      if (selectedFile) {
        // Validate file type and size
        const isValidFileType = checkFileType(selectedFile);
        if (!isValidFileType) {
          setFormState((prev) => ({
            ...prev,
            message: {
              error: true,
              message: ERROR_MESSAGES.IMAGE_UPLOAD_TYPE_ERROR,
            },
          }));
          return;
        }
        const isValidFileSize = checkFileSize(selectedFile);
        if (!isValidFileSize) {
          setFormState((prev) => ({
            ...prev,
            message: {
              error: true,
              message: ERROR_MESSAGES.IMAGE_UPLOAD_SIZE_ERROR,
            },
          }));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target!.result;
          setFormState((prev) => ({ ...prev, image: imageData as string }));
        };
        reader.readAsDataURL(selectedFile);
      }
    } catch (_error) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.IMAGE_UPLOAD_ERROR,
        },
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      deleteProduct.mutate({ id: productId });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !formState.name ||
      !formState.description ||
      !formState.basePrice ||
      !formState.onSalePrice ||
      !formState.gender ||
      !formState.sport ||
      !formState.category ||
      !formState.subcategory ||
      !formState.inventory
    ) {
      setFormState((prev) => ({
        ...prev,
        message: {
          error: true,
          message: ERROR_MESSAGES.MISSING_REQUIRED,
        },
      }));
      return;
    }
    updateProduct.mutate({
      id: productId,
      ...formState,
      basePrice: Number(formState.basePrice),
      onSalePrice: Number(formState.onSalePrice),
    });
  };

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading product details...</div>
      </div>
    );
  }
  if (fetchError || !product) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Button
        className="bg-red-500 px-4 py-2 hover:bg-red-600 xl:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 xl:dark:bg-red-600"
        onClick={handleDelete}
        disabled={formState.isDeleting}>
        {formState.isDeleting ? 'Deleting...' : 'Delete'}
      </Button>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="name"
          type="text"
          placeholder="Name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="description"
          type="text"
          placeholder="Description"
          required
          value={formState.description}
          onChange={handleChange}
        />
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="basePrice"
          type="number"
          placeholder="Base Price"
          required
          min={0}
          step={0.01}
          value={formState.basePrice}
          onChange={handleChange}
        />
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="onSalePrice"
          type="number"
          placeholder="On Sale Price"
          required
          min={0}
          step={0.01}
          value={formState.onSalePrice}
          onChange={handleChange}
        />
        <GenderSelection productGenders={formState.gender} setForm={setFormState} />
        <SportSelection
          setForm={setFormState}
          productSport={product.sport ?? undefined}
          productCategory={product.category ?? undefined}
          productSubcategory={product.subcategory ?? undefined}
        />
        <h1 className="text-xl">Size Selection</h1>
        <SizeSelection inventory={formState.inventory} setForm={setFormState} />
        {product.image ? (
          <Image
            unoptimized
            src={`https://${env.NEXT_PUBLIC_IMAGE_PROXY_HOSTNAME}/storage/v1/object/public/${product.image}`}
            alt={formState.name}
            width={200}
            height={250}
            className="m-auto rounded-sm"
          />
        ) : (
          <p>No image uploaded</p>
        )}
        <p>New Image (optional)</p>
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => handleImage(e)}
        />
        <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Updating...' : 'Update'}
        </Button>
      </form>
      {formState.message && (
        <MessageWrapper error={formState.message.error} message={formState.message.message} popup={true} />
      )}
    </div>
  );
}
