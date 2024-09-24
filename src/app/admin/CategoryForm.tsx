'use client';

import { api } from '@/trpc/react';
import React, { useState } from 'react';
import { type CategoryWithSubcategories, type SportWithCategories } from 'types';
import Button from '../_components/ui/Button';
import InputField from '../_components/ui/InputField';
import { type Category, type Subcategory } from '@prisma/client';

function SportForm() {
  const [newSport, setNewSport] = useState<string>('');
  const [message, setMessage] = useState('');

  const create = api.category.createSport.useMutation({
    onSuccess: async () => {
      setMessage('Sport created successfully!');
      setNewSport('');
    },
    onError: (error) => {
      setMessage('Error creating sport: ' + error.message);
      setNewSport('');
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create.mutate({ sport: newSport });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
      <InputField
        type="text"
        name="Sport"
        placeholder="Enter New Sport"
        handleValueChange={(value) => setNewSport(value)}
        required
      />
      <Button type="submit" disabled={!newSport}>
        Submit
      </Button>
      {message && <div className="text-center font-semibold">{message}</div>}
    </form>
  );
}

function CategoryForm() {
  const sports = api.category.getSports.useQuery();
  const [selectedSport, setSelectedSport] = useState<SportWithCategories>();
  const [newCategory, setNewCategory] = useState<string>('');
  const [message, setMessage] = useState('');

  const create = api.category.createCategory.useMutation({
    onSuccess: async () => {
      setMessage('Category created successfully!');
      setNewCategory('');
    },
    onError: (error) => {
      setMessage('Error creating category: ' + error.message);
      setNewCategory('');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create.mutate({ sportId: selectedSport!.id, category: newCategory });
  };

  return (
    sports.data && (
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <select
          id="sport"
          value={String(selectedSport?.id) ?? ''}
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          required
          onChange={(e) => {
            setSelectedSport(sports.data.find((sport: SportWithCategories) => sport.id === Number(e.target.value)));
          }}>
          <option value="" className="hidden">
            Select Sport
          </option>
          {sports.data.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
        {selectedSport && (
          <>
            {selectedSport.categories.length > 0 && (
              <div className="flex flex-col gap-2">
                <span>Existing Categories</span>
                <div className="flex flex-row gap-2">
                  {selectedSport.categories.map((category: Category) => (
                    <span className="rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700" key={category.id}>
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <InputField
              type="text"
              name="Category"
              placeholder="Enter New Category"
              handleValueChange={(value) => setNewCategory(value)}
              required
            />
            <Button type="submit" disabled={!selectedSport || !newCategory}>
              Submit
            </Button>
          </>
        )}
        {message && <div className="text-center font-semibold">{message}</div>}
      </form>
    )
  );
}

function SubcategoryForm() {
  const sports = api.category.getSports.useQuery();
  const [selectedSport, setSelectedSport] = useState<SportWithCategories>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubcategories>();
  const [newSubcategory, setNewSubcategory] = useState<string>('');
  const [message, setMessage] = useState('');

  const create = api.category.createSubcategory.useMutation({
    onSuccess: async () => {
      setMessage('Subcategory created successfully!');
      setNewSubcategory('');
    },
    onError: (error) => {
      setMessage('Error creating subcategory: ' + error.message);
      setNewSubcategory('');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create.mutate({ sportId: selectedSport!.id, categoryId: selectedCategory!.id, subcategory: newSubcategory });
  };

  return (
    sports.data && (
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <select
          id="sport"
          value={String(selectedSport?.id) ?? ''}
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          required
          onChange={(e) => {
            setSelectedSport(sports.data.find((sport: SportWithCategories) => sport.id === Number(e.target.value)));
          }}>
          <option value="" className="hidden">
            Select Sport
          </option>
          {sports.data.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
        {selectedSport && (
          <select
            value={String(selectedCategory?.id) ?? ''}
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            required
            onChange={(e) => {
              setSelectedCategory(
                selectedSport.categories.find(
                  (category: CategoryWithSubcategories) => category.id === Number(e.target.value)
                )
              );
            }}>
            <option value="" className="hidden">
              Select Category
            </option>
            {selectedSport.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {selectedCategory && (
          <>
            {selectedCategory.subcategories.length > 0 && (
              <div className="flex flex-col gap-2">
                <span>Existing Subcategories</span>
                <div className="flex flex-row gap-2">
                  {selectedCategory.subcategories.map((subcategory: Subcategory) => (
                    <span className="rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700" key={subcategory.id}>
                      {subcategory.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <InputField
              type="text"
              name="Category"
              placeholder="Enter New Subcategory"
              handleValueChange={(value) => setNewSubcategory(value)}
              required
            />
            <Button type="submit" disabled={!selectedSport || !selectedCategory || !newSubcategory}>
              Submit
            </Button>
          </>
        )}
        {message && <div className="text-center font-semibold">{message}</div>}
      </form>
    )
  );
}

function FormSelection() {
  const [selectedForm, setSelectedForm] = useState<'SPORT' | 'CATEGORY' | 'SUBCATEGORY'>('SPORT');
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => setSelectedForm('SPORT')}
          disabled={selectedForm === 'SPORT'}
          className={
            selectedForm === 'SPORT' ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''
          }>
          Create Sport
        </Button>
        <Button
          onClick={() => setSelectedForm('CATEGORY')}
          disabled={selectedForm === 'CATEGORY'}
          className={
            selectedForm === 'CATEGORY' ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''
          }>
          Create Category
        </Button>
        <Button
          onClick={() => setSelectedForm('SUBCATEGORY')}
          disabled={selectedForm === 'SUBCATEGORY'}
          className={
            selectedForm === 'SUBCATEGORY' ? 'bg-slate-300 dark:bg-slate-700 xl:bg-slate-300 xl:dark:bg-slate-700' : ''
          }>
          Create Subcategory
        </Button>
      </div>
      {selectedForm === 'SPORT' && <SportForm />}
      {selectedForm === 'CATEGORY' && <CategoryForm />}
      {selectedForm === 'SUBCATEGORY' && <SubcategoryForm />}
    </div>
  );
}

export default FormSelection;
