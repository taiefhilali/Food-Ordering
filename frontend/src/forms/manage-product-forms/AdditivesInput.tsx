import { TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useFieldArray, useFormContext } from 'react-hook-form';

const AdditivesInput = () => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additives',
  });

  const handleAdd = () => {
    append({ name: '', price: 0, icon: '' }); // Adjusting to the schema fields
  };

  return (
    <div>
      {fields.map((item, index) => (
        <div key={item.id} className="flex gap-2 mb-2 items-center">
          <TextField
            label="Icon URL"
            {...register(`additives.${index}.icon`)} // Corrected here
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderRadius: '20px', // Large rounded corners
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#f97316', // Orange outline color
                },
                '&:hover fieldset': {
                  borderColor: '#f97316', // Orange outline color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f97316', // Orange outline color when focused
                },
              },
            }}
          />
          <TextField
            label="Name"
            {...register(`additives.${index}.name`)} // Corrected here
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderRadius: '20px', // Large rounded corners
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#f97316', // Orange outline color
                },
                '&:hover fieldset': {
                  borderColor: '#f97316', // Orange outline color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f97316', // Orange outline color when focused
                },
              },
            }}
          />
          <TextField
            label="Price"
            {...register(`additives.${index}.price`)} // Corrected here
            type="number"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              borderRadius: '20px', // Large rounded corners
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#f97316', // Orange outline color
                },
                '&:hover fieldset': {
                  borderColor: '#f97316', // Orange outline color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#f97316', // Orange outline color when focused
                },
              },
            }}
          />
          <IconButton onClick={() => remove(index)} color="error">
            <RemoveIcon />
          </IconButton>
        </div>
      ))}
      <IconButton onClick={handleAdd} className='text-orange-600'>
        <AddIcon />
      </IconButton>
    </div>
  );
};

export default AdditivesInput;
