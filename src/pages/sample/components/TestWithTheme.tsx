import { Observer, observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  ButtonGroup,
  Paper,
  Link,
  Divider,
  TypographyTypeMap,
  ButtonTypeMap,
  ButtonPropsSizeOverrides,
  ButtonPropsVariantOverrides,
  ButtonPropsColorOverrides,
  TextField,
  Avatar,
  Chip,
  Tooltip,
  Alert,
  AlertTitle,
  Badge,
  IconButton,
  Checkbox,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  InputLabel,
  Switch,
  FormHelperText,
  CardMedia,
  InputAdornment,
  Icon,
  createTheme,
  ThemeProvider,
  Pagination,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { makeStyles } from '@mui/styles';
import StarIcon from '@mui/icons-material/Star';
import Spacer from '../../../components/common/Spacer';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import theme, { themeStyles } from '../../../material_ui/theme';
import merge from 'lodash/merge';
import { breakpointTheme } from '../../../material_ui/breakpoint';
import { typographyTheme } from '../../../material_ui/typography';
import { paletteTheme } from '../../../material_ui/palette';
import { componentButtonTheme } from '../../../material_ui/componentButton';
import { componentCheckboxTheme } from '../../../material_ui/componentCheckbox';
import { componentChipTheme } from '../../../material_ui/componentChip';
import { componentDialogtheme } from '../../../material_ui/componentDialog';
import TableNumberPagination from '../../../components/common/table/TableNumberPagination';
import { Formik } from 'formik';

/* eslint-disable */
const useStyles = makeStyles(() => ({
  input: {
    margin: '10px',
  },
}));

const initialTheme = {
  components: {
    MuiTableRow: {
      styleOverrides: {
        head: {
          // boxShadow: 'inset 0px -2px 0px #5A6172',
        },
      },
    },
  },
};

const TestWithTheme = observer(() => {
  const [themeData, setThemeData] = useState(initialTheme);
  const [themeDataTemp, setThemeDataTemp] = useState(initialTheme);

  const testThemeStyles = {};
  merge(
    testThemeStyles,
    themeStyles,
    breakpointTheme,
    typographyTheme,
    paletteTheme,
    componentButtonTheme,
    componentCheckboxTheme,
    componentChipTheme,
    componentDialogtheme,
    themeData
  );
  console.log('testThemeStyles');
  console.log(testThemeStyles);
  const testTheme = createTheme(testThemeStyles);

  const classes = useStyles();

  //////////////////////////////////////////////////

  function createData(name: any, calories: any, fat: any, carbs: any, protein: any) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];

  const [selected, setSelected] = useState<readonly string[]>([]);
  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  return (
    // <ThemeProvider theme={merge(theme, testTheme)}>
    <Formik
      initialValues={{ a: 'b' }}
      enableReinitialize
      // validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ values, errors, touched, setFieldValue, submitCount, submitForm, handleChange }) => (
        <Observer>
          {() => (
            <ThemeProvider theme={testTheme}>
              <div>
                <Paper elevation={0}>
                  <Spacer y={2} />
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              // indeterminate={numSelected > 0 && numSelected < rowCount}
                              // checked={rowCount > 0 && numSelected === rowCount}
                              // onChange={onSelectAllClick}
                              inputProps={{
                                'aria-label': 'select all desserts',
                              }}
                            />
                          </TableCell>
                          <TableCell>Dessert (100g serving)</TableCell>
                          <TableCell align="right">Calories</TableCell>
                          <TableCell align="right">Fat&nbsp;(g)</TableCell>
                          <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                          <TableCell align="right">Protein&nbsp;(g)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => {
                          const isItemSelected = isSelected(row.name);
                          return (
                            <TableRow
                              key={row.name}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              // hover
                              selected={isItemSelected}
                              onClick={(event) => handleClick(event, row.name)}
                            >
                              <TableCell padding="checkbox">
                                <Checkbox
                                  color="primary"
                                  inputProps={{
                                    'aria-label': 'select all desserts',
                                  }}
                                />
                              </TableCell>
                              <TableCell
                                // component="th"
                                scope="row"
                              >
                                {row.name}
                              </TableCell>
                              <TableCell align="right">{row.calories}</TableCell>
                              <TableCell align="right">{row.fat}</TableCell>
                              <TableCell align="right">{row.carbs}</TableCell>
                              <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <TableNumberPagination
                      disabled={false}
                      // disabled={true}
                      totalElements={250}
                      totalPages={25}
                    />
                  </TableContainer>
                  {/* <Pagination count={11} defaultPage={6} siblingCount={0} boundaryCount={2} /> */}
                  {/* <TableNumberPagination rowsPerPages={[10, 20, 30]} /> */}
                  <Spacer y={4} />
                  <TextField
                    fullWidth
                    label="Eng 한글"
                    multiline
                    rows={8}
                    // helperText="Almost before 한글 폰트는"
                    defaultValue={JSON.stringify(themeDataTemp, undefined, 2)}
                    onChange={(e: any) => {
                      console.log(e.target.value);
                      setThemeDataTemp(JSON.parse(e.target.value));
                    }}
                    // margin="dense"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      console.log('themeDataTemp');
                      console.log(themeDataTemp);
                      setThemeData(themeDataTemp);
                    }}
                  >
                    Theme 반영
                  </Button>
                </Paper>
              </div>
            </ThemeProvider>
          )}
        </Observer>
      )}
    </Formik>
  );
});

export default TestWithTheme;
