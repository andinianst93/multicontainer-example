"use client"
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface SeenIndex {
  number: number;
}

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState<SeenIndex[]>([]);
  const [values, setValues] = useState<{ [key: string]: number }>({});
  const [index, setIndex] = useState<string>('');

  useEffect(() => {
    fetchValues();
    fetchIndexes();
  }, []);

  const fetchValues = async () => {
    const response = await axios.get('/api/values/current');
    setValues(response.data);
  };

  const fetchIndexes = async () => {
    const response = await axios.get('/api/values/all');
    setSeenIndexes(response.data);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // Parse the input as an integer
    const parsedIndex = parseInt(index, 10);

    // Check if the parsed value is a valid integer
    if (!isNaN(parsedIndex) && Number.isInteger(parsedIndex) && parsedIndex > 0) {
      await axios.post('/api/values', {
        index: parsedIndex.toString(), 
      });
      setIndex('');
    } else {
      alert('Please enter a valid positive integer');
    }
  };

  const renderSeenIndexes = () => {    
    return seenIndexes.map(item => item.number).join(', ');
  };

  const renderValues = () => {
    const entries: JSX.Element[] = [];
    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }
    return entries;
  };

  return (
    <section className='flex flex-col items-center'>
      <form data-testid="fib-form" onSubmit={handleSubmit} className='flex flex-col space-y-2 lg:flex-row lg:items-center'>
        <label className='text-xl'>Enter your index:</label>
        <input
          type="text"
          value={index}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setIndex(event.target.value)
          }
          className='border border-gray-700 rounded mx-2 px-2 py-1 text-xl'
          autoComplete='off'
        />
        <input type="submit" value={'Submit'} className='text-lg rounded bg-blue-700 px-2 py-1 hover-bg-blue-500 text-white cursor-pointer'/>
      </form>

      <h3 className='pt-12 text-xl font-semibold'>Indices I have seen:</h3>
      <h4 className='pb-6 text-xl'>{renderSeenIndexes()}</h4>

      <h3 className='text-xl font-semibold'>Calculated values:</h3>
      <h4 className='pb-6 text-xl'>{renderValues()}</h4>
    </section>
  );
};

export default Fib;
