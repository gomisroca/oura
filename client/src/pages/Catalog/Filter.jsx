import React from 'react';

const Filter = () => {  
  const [sizeFilter, setSizeFilter] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');

  return (
    <div>
      <select value={sizeFilter} onChange={e => setSizeFilter(e.target.value)}>
        <option value="">All sizes</option>
        <option value="XS">XS</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>

      <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
        <option value="">All types</option>
        <option value="T-shirt">T-shirt</option>
        <option value="Jeans">Jeans</option>
        <option value="Jacket">Jacket</option>
        <option value="Sweater">Sweater</option>
        <option value="Dress">Dress</option>
      </select>
    </div>
  );
};

export default Filter;