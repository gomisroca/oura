'use client';

/**
 * Renders a product form component.
 *
 * @example
 * <ProductForm />
 */

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
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
  FETCH_ERROR: 'Unable to fetch category details',
  CREATE_ERROR: 'Failed to create product. Please try again.',
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
  setFormState,
  index,
}: {
  sizeObj: InventoryItem;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
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
              setFormState((prev) => {
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
  setFormState,
}: {
  inventory: InventoryItem[];
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <>
      {inventory.map((sizeObj, index) => (
        <div key={sizeObj.name} className="flex flex-col gap-2">
          <p>{sizeObj.name}</p>
          <select
            onChange={(e) => {
              const selectedColors = Array.from(e.target.selectedOptions, (option) => option.value);
              setFormState((prev) => {
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
              <option key={color} value={color} className="flex flex-row items-center gap-2">
                <Color color={color} />
                <span>{color}</span>
              </option>
            ))}
          </select>
          {/* If there are colors for the selected size, require a stock amount for each color */}
          {sizeObj.colors && sizeObj.colors.length > 0 && (
            <StockInput sizeObj={sizeObj} setFormState={setFormState} index={index} />
          )}
        </div>
      ))}
    </>
  );
}

function SizeSelection({
  inventory,
  setFormState,
}: {
  inventory: InventoryItem[];
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <>
      {/* Multiselect for sizes */}
      <select
        onChange={(e) => {
          const selectedSizes = Array.from(e.target.selectedOptions, (option) => option.value);
          setFormState((prev) => ({ ...prev, inventory: selectedSizes.map((name) => ({ name, colors: [] })) }));
        }}
        name="size"
        className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
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
      {inventory && inventory.length > 0 && <ColorSelection inventory={inventory} setFormState={setFormState} />}
    </>
  );
}

function SubcategorySelection({
  category,
  setFormState,
}: {
  category: Category;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const router = useRouter();
  const {
    data: subcategories,
    error: fetchError,
    isLoading,
  } = api.category.getAllSubcategories.useQuery({
    categoryId: Number(category.id),
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState<Category>();

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading subcategory details...</div>
      </div>
    );
  }
  if (fetchError || !subcategories) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  return (
    <>
      <p>{category.name} Subcategories</p>
      <select
        name="subcategory"
        className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setSelectedSubcategory({ name: selectedOption.text, id: Number(selectedOption.value) });
          setFormState((prev) => ({ ...prev, subcategory: Number(selectedOption.value) }));
        }}>
        <option value="" disabled selected={!selectedSubcategory}>
          Select Subcategory
        </option>
        {subcategories?.map((subcategory) => (
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
  setFormState,
}: {
  sport: Category;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const router = useRouter();
  const {
    data: categories,
    error: fetchError,
    isLoading,
  } = api.category.getCategories.useQuery({ sportId: Number(sport.id) });

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading category details...</div>
      </div>
    );
  }
  if (fetchError || !categories) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  return (
    <>
      <p>{sport.name} Categories</p>
      <select
        name="category"
        className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setFormState((prev) => ({ ...prev, category: Number(selectedOption.value) }));
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
        <SubcategorySelection key={selectedCategory.id} category={selectedCategory} setFormState={setFormState} />
      )}
    </>
  );
}

function SportSelection({ setFormState }: { setFormState: React.Dispatch<React.SetStateAction<FormState>> }) {
  const router = useRouter();
  const { data: sports, error: fetchError, isLoading } = api.category.getSports.useQuery();

  const [selectedSport, setSelectedSport] = useState<Category>();

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="text-lg">Loading sport details...</div>
      </div>
    );
  }
  if (fetchError || !sports) {
    return (
      <div className="flex flex-col items-center gap-4">
        <MessageWrapper error={true} message={ERROR_MESSAGES.FETCH_ERROR} />
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }
  return (
    <>
      <p>Sport</p>
      <select
        name="sport"
        className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
        onChange={(e) => {
          const selectedOption = e.target.options[e.target.selectedIndex];
          if (!selectedOption) return;
          setFormState((prev) => ({ ...prev, sport: Number(selectedOption.value) }));
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
      {selectedSport && <CategorySelection key={selectedSport.id} sport={selectedSport} setFormState={setFormState} />}
    </>
  );
}

function GenderSelection({ setFormState }: { setFormState: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <>
      <p>Gender</p>
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
          setFormState((prev) => ({ ...prev, gender: selectedGenders }));
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

export default function ProductCreation() {
  const utils = api.useUtils();
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  // Create mutation
  const createProduct = api.product.create.useMutation({
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
          message: error.message || ERROR_MESSAGES.CREATE_ERROR,
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
          message: 'Product created successfully!',
        },
      }));
    },
  });

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formState.name ||
      !formState.description ||
      !formState.basePrice ||
      !formState.onSalePrice ||
      !formState.image ||
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
    createProduct.mutate({
      ...formState,
      basePrice: Number(formState.basePrice),
      onSalePrice: Number(formState.onSalePrice),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          name="description"
          type="text"
          placeholder="Description"
          required
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
          onChange={handleChange}
        />
        <GenderSelection setFormState={setFormState} />
        <SportSelection setFormState={setFormState} />
        <SizeSelection inventory={formState.inventory} setFormState={setFormState} />
        <input
          className="w-full rounded-sm bg-neutral-300 px-4 py-2 dark:bg-neutral-700"
          type="file"
          name="image"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => handleImage(e)}
        />
        <Button type="submit" disabled={createProduct.isPending}>
          {createProduct.isPending ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
      {formState.message && (
        <MessageWrapper error={formState.message.error} message={formState.message.message} popup={true} />
      )}
    </div>
  );
}
