import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useStore } from '../../../contexts/StoreProvider';
import { LoadingButton } from '@mui/lab';
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
  Tabs,
  Tab,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { DistributiveOmit, OverridableStringUnion } from '@mui/types';
import { makeStyles } from '@mui/styles';
import * as yup from 'yup';
import {
  FastField,
  Formik,
  Form,
  FieldArray,
  useFormikContext,
  FormikHelpers,
  FormikTouched,
  Field,
  FormikValues,
} from 'formik';
import _, { initial } from 'lodash';
import { TextField as FMTextField, Checkbox as FMCheckBox, CheckboxWithLabel } from 'formik-mui';
import { FavoriteBorder, Favorite, PhotoCamera, Visibility, Notifications } from '@mui/icons-material';
import MailIcon from '@mui/icons-material/Mail';
import {
  CheckBoxData,
  FormArrayTextField1,
  FormCheckBox1,
  FormCheckBox2,
  FormCheckBoxes2,
  FormCheckBoxesWithTitle2,
  FormCheckBoxWithLabel1,
  FormCheckBoxWithLabel2,
  FormTextField1,
  FormTextField2,
} from '../../../components/sample/FormComponents';
import { Variant } from '@mui/material/styles/createTypography';
import { DataGrid } from '@mui/x-data-grid';
import StarIcon from '@mui/icons-material/Star';
import Spacer from '../../../components/common/Spacer';
// import MUIRichTextEditor from 'mui-rte';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet, Link as RouterLink } from 'react-router-dom';
import FileUpload from './FileUpload';
import TypographyComponents from './Typography';

/* eslint-disable */
const useStyles = makeStyles(() => ({
  input: {
    margin: '10px',
  },
  deleteButton: {
    margin: '15px',
  },
  checkboxRoot: {
    marginRight: '50px',
  },
  buttonMargin: {
    margin: '20px',
    padding: '20px',
  },
  buttonMarginBlack: {
    margin: '20px',
    padding: '20px',
    backgroundColor: 'black',
  },
  dialog: {
    maxWidth: '1440px',
    margin: '0px',
  },
  formHelperText: {
    color: 'green',
  },
  bold: {
    fontWeight: 'bold',
  },
}));

const AllComponents = observer(() => {
  const classes = useStyles();

  const typographyVariant: (Variant | 'body')[] = [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body',
    'body1',
    'body2',
    'overline',
    'caption',
  ];

  const buttonTypography: OverridableStringUnion<'small' | 'medium' | 'large', ButtonPropsSizeOverrides>[] = [
    'xlarge',
    'large',
    'medium',
    'small',
  ];

  const buttonColor: OverridableStringUnion<
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    ButtonPropsColorOverrides
  >[] = ['primary', 'secondary', 'third'];

  const buttonVariant: OverridableStringUnion<'text' | 'outlined' | 'contained', ButtonPropsVariantOverrides>[] = [
    'contained',
    'outlined',
    'text',
    'roundContained',
    'roundOutlined',
  ];

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'firstName', headerName: 'English', width: 130 },
    { field: 'lastName', headerName: '한글', width: 130 },
  ];

  const rows = [{ id: 1, lastName: '존', firstName: 'Jone', age: 35 }];

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [age, setAge] = useState('10');

  const handleChange = (event: any) => {
    setAge(event.target.value);
  };

  const rteSave = (data: any) => {
    console.log(data);
  };

  const components = [
    {
      name: 'Typography',
      to: 'typography',
    },
    {
      name: 'File Upload',
      to: 'fileupload',
    },
    {
      name: 'All Components',
      to: 'all',
    },
  ];

  return (
    <>
      <div>
        <Paper elevation={0}>
          {/* <Routes>
            <Route path="/">
              <Route path="fileupload" element={<FileUpload />} />
            </Route>
          </Routes> */}
          {/* <MUIRichTextEditor
            label="Start typing..."
            inlineToolbar={true}
            onSave={rteSave}
            // controls={['my-style']}
            // customControls={[
            //   {
            //     name: 'my-style',
            //     icon: <InvertColorsIcon />,
            //     type: 'inline',
            //     inlineStyle: {
            //       backgroundColor: 'black',
            //       color: 'white',
            //     },
            //   },
            // ]}
          />
          <MUIRichTextEditor label="Start typing..." inlineToolbar={true} onSave={rteSave} /> */}
          <br />
          <LoadingButton loading variant="outlined" color="secondary">
            Submit
          </LoadingButton>
          <LoadingButton variant="outlined" color="secondary">
            Submit
          </LoadingButton>
          {typographyVariant.map((variant) => (
            <>
              <br />
              <Typography
                // color="textPrimary"
                variant={variant}
              >
                {variant} - Almost before 한글 폰트는
              </Typography>
            </>
          ))}
          <br />
          <br />
          {buttonTypography.map((size) => {
            return (
              <>
                <Typography variant="h3">{size}</Typography>
                {buttonColor.map((color) => {
                  return (
                    <div className={color === 'third' ? classes.buttonMarginBlack : classes.buttonMargin}>
                      {buttonVariant.map((variant) => {
                        return (
                          <>
                            <Button variant={variant} color={color} size={size}>
                              {size} {color} {variant}
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant={variant} color={color} size={size} disabled>
                              {size} {color} {variant} disabled
                            </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <LoadingButton loading variant={variant} color={color} size={size}>
                              Submit
                            </LoadingButton>
                            <br />
                            <br />
                          </>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            );
          })}
          <TextField label="Eng 한글" helperText="Almost before 한글 폰트는" defaultValue="Almost before 한글 폰트는" />
          <Spacer y={2} />
          <TextField
            size="small"
            label="Eng 한글"
            helperText="Almost before 한글 폰트는"
            defaultValue="Almost before 한글 폰트는"
            margin="normal"
            disabled
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    // onClick={handleClickShowPassword}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    <Visibility />
                    {/* {values.showPassword ? <VisibilityOff /> : <Visibility />} */}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <br />
          <TextField
            type="number"
            size="small"
            label="Eng 한글"
            helperText="Almost before 한글 폰트는"
            defaultValue="1"
            margin="dense"
          />
          <FormHelperText error>form helper text</FormHelperText>
          <FormHelperText className={classes.formHelperText}>form helper text</FormHelperText>
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <br />
          <br />
          <Avatar>NFT</Avatar>
          <Avatar>한글</Avatar>
          <Chip label="Almost before 한글 폰트는" />
          <br />
          {/* <Chip label="Almost before 한글 폰트는" size="small" /><br/> */}
          <Tooltip title="Almost before 한글 폰트는" placement="right" arrow>
            <Button>Tooltip</Button>
          </Tooltip>
          <br />
          <Alert severity="error">
            <AlertTitle>Almost before 한글 폰트는</AlertTitle>
            Almost before 한글 폰트는
          </Alert>
          <Alert severity="warning">
            <AlertTitle>Almost before 한글 폰트는</AlertTitle>
            Almost before 한글 폰트는
          </Alert>
          <Alert severity="success">
            <AlertTitle>Almost before 한글 폰트는</AlertTitle>
            Almost before 한글 폰트는
          </Alert>
          <Alert severity="info" action={<Button size="small">Action</Button>}>
            <AlertTitle>Almost before 한글 폰트는</AlertTitle>
            Almost before 한글 폰트는
          </Alert>
          <br />
          <Checkbox />
          <Checkbox disabled />
          <Checkbox checked />
          <Checkbox checked disabled />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <FormControlLabel control={<Checkbox />} label="Label" />
          <FormControlLabel disabled control={<Checkbox />} label="Label" />
          <FormControlLabel checked control={<Checkbox />} label="Label" />
          <FormControlLabel checked disabled control={<Checkbox />} label="Label" />
          <br />
          <Checkbox size="small" />
          <Checkbox size="small" disabled />
          <Checkbox size="small" checked />
          <Checkbox size="small" checked disabled />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <FormControlLabel control={<Checkbox size="small" />} label="Label" />
          <FormControlLabel disabled control={<Checkbox size="small" />} label="Label" />
          <FormControlLabel checked control={<Checkbox size="small" />} label="Label" />
          <FormControlLabel checked disabled control={<Checkbox size="small" />} label="Label" />
          <br />
          <Switch defaultChecked />
          <Switch defaultChecked color="secondary" />
          <br />
          <Button variant="outlined" onClick={handleClickOpen}>
            Open alert dialog
          </Button>
          <br />
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            className={classes.dialog}
          >
            <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {/* Let Google help apps determine location. This means sending anonymous location data to Google, even when
                no apps are running. Let Google help apps determine location. This means sending anonymous location data
                to Google, even when no apps are running.Let Google help apps determine location. This means sending
                anonymous location data to Google, even when no apps are running.Let Google help apps determine
                location. This means sending anonymous location data to Google, even when no apps are running.Let Google
                help apps determine location. This means sending anonymous location data to Google, even when no apps
                are running.Let Google help apps determine location. This means sending anonymous location data to
                Google, even when no apps are running.Let Google help apps determine location. This means sending
                anonymous location data to Google, even when no apps are running. */}
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에
                {/* 전달조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에
                전달조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에
                전달조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에
                전달조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에
                전달조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
                조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 */}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="text" onClick={handleClose}>
                Disagree
              </Button>
              <Button variant="contained" onClick={handleClose} autoFocus>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
          <br />
          <Link href="#" variant="body2">
            LINK
          </Link>
          <br />
          <Link href="#" underline="none" variant="body2" color="secondary" className={classes.bold}>
            LINK
          </Link>
          <br />
          <IconButton aria-label="start" size="medium">
            <StarIcon fontSize="large" />
          </IconButton>
          <IconButton aria-label="start" size="medium" disabled>
            <StarIcon fontSize="large" />
          </IconButton>
          <IconButton color="secondary">
            <ImageIcon fontSize="large" />
          </IconButton>
          {/* <DataGrid rows={rows} columns={columns} autoHeight />
          <br />
          <Badge badgeContent="4" color="primary">
            <MailIcon color="action" />
          </Badge>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Badge badgeContent="Eng" color="primary">
            <MailIcon color="action" />
          </Badge>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Badge badgeContent="한" color="primary">
            <MailIcon color="action" />
          </Badge>
          <br />
          <Button variant="contained" color="primary" size="xlarge">
            Contained Primary XLarge
          </Button>
          <Button variant="contained" color="primary" size="large">
            Contained Primary Large
          </Button>
          <Button variant="contained" color="third" size="xlarge">
            Contained Primary XLarge
          </Button>
          <Button variant="roundContained" color="third" size="xlarge">
            Contained Primary XLarge
          </Button> */}
          <br />
          <br />
          <Tabs value={0}>
            <Tab label="Tab" />
            <Tab label="Tab" />
            <Tab label="Tab" />
          </Tabs>
          <br />
          <Tabs value={0}>
            <Tab icon={<Notifications />} />
            <Tab icon={<Notifications />} />
            <Tab icon={<Notifications />} />
          </Tabs>
          <br />
          <Tabs value={0}>
            <Tab icon={<Notifications />} label="Tab" />
            <Tab icon={<Notifications />} label="Tab" />
            <Tab icon={<Notifications />} label="Tab" />
          </Tabs>
          <br />
        </Paper>
      </div>
    </>
  );
});

export default AllComponents;
