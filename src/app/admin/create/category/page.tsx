'use client';

import { api } from '@/trpc/react';
import React, { useState } from 'react';
import { type CategoryWithSubcategories, type SportWithCategories } from 'types';
import Button from '@/app/_components/ui/Button';
import InputField from '@/app/_components/ui/InputField';
import { type Sport, type Category, type Subcategory } from '@prisma/client';
import Spinner from '@/app/_components/ui/Spinner';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';

function SportForm({ sports }: { sports: SportWithCategories[] }) {
  const [newSport, setNewSport] = useState<string>('');
  const [message, setMessage] = useState({ error: true, message: '' });

  const create = api.category.createSport.useMutation({
    onSuccess: async () => {
      setMessage({ error: false, message: 'Sport created successfully!' });
      setNewSport('');
    },
    onError: (error) => {
      setMessage({ error: true, message: 'Error creating sport: ' + error.message });
      setNewSport('');
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create.mutate({ sport: newSport });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
      {sports && sports.length > 0 && (
        <div className="flex flex-col gap-2">
          <span>Existing Sports</span>
          <div className="flex flex-row gap-2">
            {sports.map((sport: Sport) => (
              <span className="rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700" key={sport.id}>
                {sport.name}
              </span>
            ))}
          </div>
        </div>
      )}
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
      {message.message && <MessageWrapper error={message.error} message={message.message} />}
    </form>
  );
}

function CategoryForm({ sports }: { sports: SportWithCategories[] }) {
  const [selectedSport, setSelectedSport] = useState<SportWithCategories>();
  const [newCategory, setNewCategory] = useState<string>('');
  const [message, setMessage] = useState({ error: true, message: '' });

  const create = api.category.createCategory.useMutation({
    onSuccess: async () => {
      setMessage({ error: false, message: 'Category created successfully!' });
      setNewCategory('');
    },
    onError: (error) => {
      setMessage({ error: true, message: 'Error creating category: ' + error.message });
      setNewCategory('');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create.mutate({ sportId: selectedSport!.id, category: newCategory });
  };

  return (
    sports && (
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <select
          id="sport"
          value={String(selectedSport?.id) ?? ''}
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          required
          onChange={(e) => {
            setSelectedSport(sports.find((sport: SportWithCategories) => sport.id === Number(e.target.value)));
          }}>
          <option value="" className="hidden">
            Select Sport
          </option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>
        {selectedSport && (
          <>
            {selectedSport.categories && selectedSport.categories.length > 0 && (
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
        {message.message && <MessageWrapper error={message.error} message={message.message} />}
      </form>
    )
  );
}

function SubcategoryForm({ sports }: { sports: SportWithCategories[] }) {
  const [selectedSport, setSelectedSport] = useState<SportWithCategories>();
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithSubcategories>();
  const [newSubcategory, setNewSubcategory] = useState<string>('');
  const [message, setMessage] = useState({ error: true, message: '' });

  const create = api.category.createSubcategory.useMutation({
    onSuccess: async () => {
      setMessage({ error: false, message: 'Subcategory created successfully!' });
      setNewSubcategory('');
    },
    onError: (error) => {
      setMessage({ error: true, message: 'Error creating subcategory: ' + error.message });
      setNewSubcategory('');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    create.mutate({ sportId: selectedSport!.id, categoryId: selectedCategory!.id, subcategory: newSubcategory });
  };

  return (
    sports && (
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
        <select
          id="sport"
          value={String(selectedSport?.id) ?? ''}
          className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
          required
          onChange={(e) => {
            setSelectedSport(sports.find((sport: SportWithCategories) => sport.id === Number(e.target.value)));
          }}>
          <option value="" className="hidden">
            Select Sport
          </option>
          {sports.map((sport) => (
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
            {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
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
        {message.message && <MessageWrapper error={message.error} message={message.message} />}
      </form>
    )
  );
}

function FormSelection() {
  const { data: sports, status } = api.category.getSports.useQuery();
  const [selectedForm, setSelectedForm] = useState<'SPORT' | 'CATEGORY' | 'SUBCATEGORY'>('SPORT');

  return status === 'pending' ? (
    <Spinner />
  ) : status === 'error' ? (
    <MessageWrapper message="Unable to fetch sports at this time" />
  ) : (
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
      {selectedForm === 'SPORT' && <SportForm sports={sports as SportWithCategories[]} />}
      {selectedForm === 'CATEGORY' && <CategoryForm sports={sports as SportWithCategories[]} />}
      {selectedForm === 'SUBCATEGORY' && <SubcategoryForm sports={sports as SportWithCategories[]} />}
    </div>
  );
}

export default FormSelection;
