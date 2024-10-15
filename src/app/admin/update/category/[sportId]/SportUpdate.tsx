'use client';

import Button from '@/app/_components/ui/Button';
import MessageWrapper from '@/app/_components/ui/MessageWrapper';
import { api } from '@/trpc/react';
import { useEffect, useState } from 'react';

export default function SportUpdate({ id }: { id: string }) {
  const utils = api.useUtils();
  const { data: sport } = api.category.getUniqueSport.useQuery({ id: Number(id) });

  const [formMessage, setFormMessage] = useState({ error: true, message: '' });
  const [name, setName] = useState('');

  useEffect(() => {
    if (sport) {
      setName(sport.name);
    }
  }, [sport]);

  const updateSport = api.category.updateSport.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.category.invalidate();
      setFormMessage({ error: false, message: 'Sport updated successfully!' });
    },
  });

  const deleteSport = api.category.deleteSport.useMutation({
    onError: () => {
      setFormMessage({ error: true, message: 'Something went wrong. Please try again.' });
    },
    onSuccess: async () => {
      await utils.category.invalidate();
      setFormMessage({ error: false, message: 'Sport deleted successfully!' });
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setFormMessage({ error: false, message: '' });
    e.preventDefault();

    updateSport.mutate({
      id: Number(id),
      name,
    });
  };

  if (sport) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Button
          className="bg-red-500/80 dark:bg-red-600 xl:bg-red-500/80 xl:dark:bg-red-600/80"
          onClick={() => deleteSport.mutate({ id: Number(id) })}>
          Delete
        </Button>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-2">
          <p>Name</p>
          <input
            className="w-full rounded-full bg-slate-300 px-4 py-2 dark:bg-slate-700"
            name="name"
            type="text"
            placeholder="Sport Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Button type="submit" disabled={updateSport.isPending}>
            {updateSport.isPending ? 'Submitting...' : 'Submit'}
          </Button>
          {formMessage.message && (
            <MessageWrapper error={formMessage.error} message={formMessage.message} popup={true} />
          )}
        </form>
      </div>
    );
  }
  return null;
}
