import { observer } from 'mobx-react-lite';
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
import { FavoriteBorder, Favorite, PhotoCamera, Visibility } from '@mui/icons-material';
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
  dialog: {
    maxWidth: '1440px',
    margin: '0px',
  },
}));

const DialogComponents = observer(() => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [open2, setOpen2] = useState(false);
  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  return (
    <>
      <br />
      <br />
      <Typography variant="h4">Dialog</Typography>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        Open Dialog without scroll (no dividers)
      </Button>
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
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onClick={handleClose}>
            Disagree
          </Button>
          <Button variant="contained" onClick={handleClose}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <br />
      <br />
      <Button variant="outlined" onClick={handleClickOpen2}>
        Open Dialog with scroll (dividers in DialogContent)
      </Button>
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        className={classes.dialog}
      >
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
            조회조건은 additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달 조회조건은
            additionalInfo에 Map으로 관리하며, 조회버튼 클릭시 각 파라미터에 할당하여 백엔드에 전달
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" size="large" onClick={handleClose2}>
            Disagree
          </Button>
          <Button variant="contained" size="large" onClick={handleClose2}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <br />
    </>
  );
});

export default DialogComponents;
