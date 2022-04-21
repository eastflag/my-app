import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Spacer from '../../../components/common/Spacer';

const SelectComponents = () => {
  return (
    <div>
      <br />
      <Typography variant="h4">Select</Typography>
      <br />
      <Typography variant="h5">Medium</Typography>
      <br />
      <Typography variant="h6">Value: False</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="medium">
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
        </FormControl>
      </Box>
      <br />
      <Typography variant="h6">Value: True</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="medium">
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <br />
      <Typography variant="h5">Small</Typography>
      <br />
      <Typography variant="h6">Value: False</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="small">
          <Select label={'Label'} />
          <InputLabel>Label</InputLabel>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
        </FormControl>
      </Box>
      <br />
      <Typography variant="h6">Value: True</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="small">
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <br />
      <Typography variant="h5">Medium</Typography>
      <br />
      <Typography variant="h6">Value: False</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="medium">
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} startAdornment={<RemoveRedEyeIcon />} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} startAdornment={<RemoveRedEyeIcon />} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} startAdornment={<RemoveRedEyeIcon />} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} startAdornment={<RemoveRedEyeIcon />} />
        </FormControl>
      </Box>
      <br />
      <Typography variant="h6">Value: True</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="medium">
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'} startAdornment={<RemoveRedEyeIcon />}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'} startAdornment={<RemoveRedEyeIcon />}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'} startAdornment={<RemoveRedEyeIcon />}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'} startAdornment={<RemoveRedEyeIcon />}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <br />
      <Typography variant="h5">Small</Typography>
      <br />
      <Typography variant="h6">Value: False</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="small">
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} startAdornment={<RemoveRedEyeIcon />} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} startAdornment={<RemoveRedEyeIcon />} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} startAdornment={<RemoveRedEyeIcon />} />
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} startAdornment={<RemoveRedEyeIcon />} />
        </FormControl>
      </Box>
      <br />
      <Typography variant="h6">Value: True</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="small">
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'} startAdornment={<RemoveRedEyeIcon />}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'} startAdornment={<RemoveRedEyeIcon />}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'} startAdornment={<RemoveRedEyeIcon />}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="small" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} value={'Value'} startAdornment={<RemoveRedEyeIcon />}>
            <MenuItem value={'Value'}>Value</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <br />
      <Typography variant="h5">Helper Text</Typography>
      <br />
      <Box display={'flex'}>
        <FormControl sx={{ width: 220 }} size="medium">
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
          <FormHelperText>Helper text</FormHelperText>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" focused>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
          <FormHelperText>Helper text</FormHelperText>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" error>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
          <FormHelperText>Helper text</FormHelperText>
        </FormControl>
        <Spacer x={1} />
        <FormControl sx={{ width: 220 }} size="medium" disabled>
          <InputLabel>Label</InputLabel>
          <Select label={'Label'} />
          <FormHelperText>Helper text</FormHelperText>
        </FormControl>
      </Box>
      <br />
    </div>
  );
};

export default SelectComponents;
