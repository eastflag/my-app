import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { observer, useObserver } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../../contexts/StoreProvider';
import {
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as Yup from 'yup';
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
import { FavoriteBorder, Favorite } from '@mui/icons-material';

// /* eslint-disable */
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
}));

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must contain at least 8 characters').required('Enter your password'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Password does not match'),
  phones: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().min(2, 'too short').required('Required'), // these constraints take precedence
        number: Yup.number().min(3, 'cmon').required('Required'), // these constraints take precedence
      })
    )
    .required('Must have Phone') // these constraints are shown if and only if inner constraints are satisfied
    .min(1, 'Minimum of 1 phone'),
  interests: Yup.array()
    .of(Yup.string())
    // .required('Must have interest') // these constraints are shown if and only if inner constraints are satisfied
    .min(1, 'Minimum of 1 interest'),
  subscription: Yup.boolean(),
});

// phones 와 같이 2-depth 에 해당하는 데이터가 없는 경우는, 아래를 이용하여 type 정의 가능
// type AccountInfo = Yup.InferType<typeof validationSchema>;
interface AccountInfo {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phones: Phone[];
  interests: string[];
  subscription: boolean;
}

interface Phone {
  name: string;
  number: number;
}

interface Interest {
  label: string;
  name: string;
  value: boolean;
}

const FormTitle = observer(() => {
  const { accountStore } = useStore();
  return (
    <Typography variant="h3" gutterBottom>
      Form - Formik & MUI {accountStore.loading ? '...loading...' : ''}
    </Typography>
  );
});

const SubmitButton = observer((props: { [key: string]: string | object }) => {
  const { accountStore } = useStore();
  const { dirty } = useFormikContext<FormikValues>();
  const fc = useFormikContext<FormikValues>();
  return (
    <Button
      // disabled={!(dirty && isValid)} // 변경이 있고, 에러가 없을때만 submit 버튼 활성화
      disabled={accountStore.loading || !dirty} // 로딩중이 아니고, 변경있을때 활성화
      type="submit"
      // onClick={() => {
      //   fc.submitForm();
      //   fc.setSubmitting(false);
      // }}
      fullWidth
      variant="contained"
      color="primary"
      size="large"
      {...props}
    >
      Submit
    </Button>
  );
});

// const AccountForm = observer(() => {
//   const { accountStore } = useStore();

//   const initialValues: AccountInfo = {
//     name: accountStore.name,
//     email: accountStore.email,
//     confirmPassword: accountStore.confirmPassword,
//     password: accountStore.password,
//     phones: accountStore.phones,
//     interests: accountStore.interests,
//     subscription: accountStore.subscription,
//   };

//   return <AccountFormik initialValues={initialValues} />;
// });

// interface AccountFormikProps {
//   initialValues: AccountInfo;
// }

const AccountForm = observer(() => {
  const { accountStore } = useStore();
  const classes = useStyles();
  // const accountInfo = _.cloneDeep(accountStore);

  const initialValues: AccountInfo = {
    name: accountStore.name,
    email: accountStore.email,
    confirmPassword: accountStore.confirmPassword,
    password: accountStore.password,
    phones: accountStore.phones,
    interests: accountStore.interests,
    subscription: accountStore.subscription,
  };

  // initial fetch
  useEffect(() => {
    accountStore.fetchApi();
  }, []);

  const handleSubmit = async (values: AccountInfo, actions: FormikHelpers<AccountInfo>) => {
    alert('SUBMITTED\n\n' + JSON.stringify(values, null, 2));
    actions.setSubmitting(false); // submit 진행중일때 inactive 방지
    const result = await accountStore.updateApi();
    if (result) {
      actions.resetForm({ values: values }); // submit button 비활성화(dirty reset)를 위해 입력받은 값과 함께 resetForm 처리
    } else {
      // error 표시처리 필요, submit button은 활성화 상태 그대로 남음
    }
  };

  interface FormProps {
    name: string;
    label: string;
    error?: boolean | undefined;
    helperText?: string;
    defaultHelperText?: string;
    errorCheckOnBlur?: boolean;
    errorCheckOnChange?: boolean;
    errorCheckWhenOnlyTouched?: true;
    showError?: boolean;
    [key: string]: any; // eslint-disable-line
  }

  interface FormTextFieldProps {
    name: string;
    label: string;
    helperText?: string;
    [key: string]: any; // eslint-disable-line
  }

  const FormTextField = ({ name, label, helperText = '', ...children }: FormTextFieldProps) => {
    return <Field component={FMTextField} name={name} label={label} helperText={helperText} {...children} />;
  };

  const FormTextField0 = ({ name, label, error = undefined, helperText = '', ...children }: FormProps) => {
    const { handleChange, handleBlur, setFieldTouched, touched, errors, values } = useFormikContext<FormikValues>();
    const value = values[name];
    /* eslint-disable */

    const fieldTouched = touched[name];
    const fieldError = errors[name];

    const errorText = fieldTouched && fieldError;
    if (error === undefined) {
      error = fieldTouched && Boolean(fieldError);
    }

    // /* eslint-enable */
    return (
      <TextField
        id={name}
        name={name}
        helperText={errorText ? errorText : helperText}
        error={error}
        label={label}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.input}
        {...children}
      />
    );
  };

  interface FormArrayProps {
    arrayName: string;
    name: string;
    value: any; // eslint-disable-line
    label: string;
    helperText?: string;
    error?: boolean | undefined;

    defaultHelperText?: string;
    errorCheckOnBlur?: boolean;
    errorCheckOnChange?: boolean;
    errorCheckWhenOnlyTouched?: true;
    showError?: boolean;
    [key: string]: any; // eslint-disable-line
    index: number;
  }

  const FormArrayTextFieldN = ({ arrayName, name, value, index, label, ...children }: FormArrayProps) => {
    return (
      <Field
        component={FMTextField}
        id={`${arrayName}[${index}][${name}]`}
        name={`${arrayName}[${index}][${name}]`}
        label={label}
        value={value[name]}
        {...children}
      />
    );
  };

  const FormArrayTextField = ({
    // ??? formik-mui 와 동일한 사용방식을 제공해야할듯
    arrayName,
    name,
    value,
    index,
    label,
    helperText = '',
    error = undefined,
    ...children
  }: FormArrayProps) => {
    const { handleChange, handleBlur, touched, errors } = useFormikContext<FormikValues>();

    const fieldTouched = (touched[arrayName] as any[])?.at(index)?.[name];
    const fieldError = (errors[arrayName] as any[])?.at(index)?.[name];

    const errorText = fieldTouched && fieldError;
    if (error === undefined) {
      error = fieldTouched && Boolean(fieldError);
    }

    return (
      <TextField
        id={`${arrayName}[${index}][${name}]`}
        name={`${arrayName}[${index}][${name}]`}
        helperText={errorText ? errorText : helperText}
        error={error}
        label={label}
        value={value[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        {...children}
      />
    );
  };

  // Backup
  // const FormArrayTextField = ({
  //   // ??? formik-mui 와 동일한 사용방식을 제공해야할듯
  //   arrayName,
  //   name,
  //   value,
  //   index,
  //   label,
  //   defaultHelperText = '',
  //   errorCheckOnBlur = true,
  //   errorCheckOnChange = false,
  //   errorCheckWhenOnlyTouched = true,
  //   showError = true,
  //   ...children
  // }: FormArrayProps) => {
  //   const { handleChange, handleBlur, setFieldTouched, touched, errors } = useFormikContext<FormikValues>();

  //   let fieldTouched = false;
  //   try {
  //     // fieldTouched = (((touched as FormikTouched<any>)[arrayName] as any[])?.at(index))[name];
  //     fieldTouched = ((touched[arrayName] as any[])?.at(index))[name];
  //   } catch (e) {
  //     fieldTouched = false;
  //   }
  //   let fieldError = false;
  //   try {
  //     // fieldError = ((errors as FormikTouched<any>)[arrayName] as any[])?.at(index)[name];
  //     fieldError = (errors[arrayName] as any[])?.at(index)[name];
  //   } catch (e) {
  //     fieldError = false;
  //   }

  //   const errorTouchCondition =
  //     showError && ((errorCheckWhenOnlyTouched && fieldTouched) || !errorCheckWhenOnlyTouched);
  //   const helperText = errorTouchCondition && (fieldError ?? defaultHelperText);
  //   const error = errorTouchCondition && Boolean(fieldError);

  //   return (
  //     <TextField
  //       key={`${arrayName}[${index}][${name}]`}
  //       id={`${arrayName}[${index}][${name}]`}
  //       name={`${arrayName}[${index}][${name}]`}
  //       helperText={helperText}
  //       error={error}
  //       label={label}
  //       value={value[name]}
  //       onChange={handleChange}
  //       onBlur={handleBlur}
  //       {...children}
  //     />
  //   );
  // };

  interface CheckBoxData {
    label: string;
    value: string | boolean | number;
  }

  const interestsSet: CheckBoxData[] = [
    {
      label: 'Game',
      value: 'game',
    },
    {
      label: 'Sport',
      value: 'sport',
    },
    {
      label: 'Book',
      value: 'book',
    },
  ];

  interface FormCheckBoxesProps {
    checkboxData: CheckBoxData[];
    name: string;
    [key: string]: any;
  }

  const FormCheckBoxes = ({ checkboxData, name, ...children }: FormCheckBoxesProps) => {
    const formikContext = useFormikContext<FormikValues>();
    const values = formikContext.values[name];
    const classes = useStyles();
    return (
      <>
        {checkboxData.map((checkBoxItem, index) => (
          <Field
            type="checkbox"
            component={CheckboxWithLabel}
            name={name}
            key={checkBoxItem.value}
            value={checkBoxItem.value}
            Label={{ label: checkBoxItem.label }}
            checked={values.includes(checkBoxItem.value)}
            {...children}
          />
        ))}
      </>
    );
  };

  interface FormItemLabel {
    title?: string;
    helperText?: string;
  }

  const FormCheckBoxesWithTitle = ({
    checkboxData,
    name,
    title,
    helperText,
    ...children
  }: FormCheckBoxesProps & FormItemLabel) => {
    const formikContext = useFormikContext<FormikValues>();
    const { touched, errors } = formikContext;
    return (
      <FormControl error={touched[name] && !!errors[name]} component="fieldset" variant="standard">
        <FormLabel component="legend">{title}</FormLabel>
        <FormGroup>
          <FormCheckBoxes checkboxData={checkboxData} name={name} {...children} />
        </FormGroup>
        <FormHelperText>{errors[name] ? errors[name] : helperText}</FormHelperText>
      </FormControl>
    );
  };

  interface FormCheckBoxProps {
    name: string;
    [key: string]: any;
  }

  const FormCheckBox = ({ name, ...children }: FormCheckBoxProps) => {
    const formikContext = useFormikContext<FormikValues>();
    const value = formikContext.values[name];
    return (
      <>
        <Field component={FMCheckBox} type="checkbox" name={name} {...children} />
      </>
    );
  };

  const FormCheckBoxC = ({ name, label = '', disabled = false, ...children }: FormCheckBoxProps) => {
    const formikContext = useFormikContext<FormikValues>();
    const value = formikContext.values[name];
    return (
      <FormControlLabel
        disabled={disabled}
        control={
          <Checkbox
            id={name}
            name={name}
            value={value}
            checked={value}
            onChange={formikContext.handleChange}
            onBlur={formikContext.handleBlur}
            className={classes.input}
            {...children}
          />
        }
        label={label}
      />
    );
  };

  return (
    <>
      <div>
        <Paper elevation={0}>
          {accountStore.password}
          {accountStore.confirmPassword}
          {JSON.stringify(accountStore.phones)}
          <FormTitle />
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            // validateOnChange={false}
          >
            {({
              // values: { name, email, password, confirmPassword, phones, interests, subscription },
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              validateField,
              validateForm,
              setFieldValue,
              resetForm,
            }) => (
              <Form>
                <FormTextField name="name" label="Name" fullWidth className={classes.input} />
                <FormTextField
                  name="email"
                  label="Email"
                  type="email"
                  error={!!errors.email} // 입력중일때 error표시가 필요한 경우 (default는 onBlur시 에러 표시됨)
                  fullWidth
                  className={classes.input}
                />
                {/* <Field
                  component={FMTextField}
                  name="email"
                  type="email"
                  label="Email"
                  // error={!!errors.email} // onChange시에 바로 에러 표시 하고 싶을때 처리
                  // error={touched.email && !!errors.email} // blur할때만 에러 표시 하고 싶을때 처리 = default??
                  // onBlur={() => {}} // blur 시 에러처리 하지 않도록 할때 주면 댐
                  className={classes.input}
                  fullWidth
                /> */}
                {/* <FormTextField name="email" label="Email" fullWidth className={classes.input} /> */}
                <FormTextField0
                  name="password"
                  label="Password"
                  helperText="Enter at least 2 characters"
                  fullWidth
                  className={classes.input}
                />
                <FormTextField
                  name="confirmPassword"
                  label="Confirm Password"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  fullWidth
                  // onChange={(event: any) => {
                  //   setFieldValue('confirmPassword', event.target.value, true);

                  //   // const t = JSON.parse(JSON.stringify(values));
                  //   // t.confirmPassword = event.target.value;
                  //   // validateForm(t);
                  // }}
                  className={classes.input}
                />
                {/* <Field component={FMCheckBox} type="checkbox" name="subscription" /> */}
                {/* <Field
                  component={FMCheckBox}
                  type="checkbox"
                  name="subscription"
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                /> */}
                <Divider />
                <Typography className={classes.input}>Subscription : </Typography>
                <FormCheckBoxC name="subscription" />
                <FormCheckBoxC name="subscription" label="text" />
                <FormCheckBoxC name="subscription" icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                <FormCheckBox name="subscription" />
                <FormCheckBox name="subscription" icon={<FavoriteBorder />} checkedIcon={<Favorite />} />

                {/* <FormControl
                  error={touched.interests && !!errors.interests}
                  component="fieldset"
                  // variant="standard"
                  className={classes.input}
                >
                  <FormLabel component="legend">Assign responsibility</FormLabel>
                  <FormGroup>
                    <FormCheckBoxes color="secondary" checkboxData={interestsSet} name="interests" />
                  </FormGroup>
                  <FormHelperText>{errors.interests}</FormHelperText>
                </FormControl> */}

                <Divider />
                <div className={classes.input}>
                  <FormCheckBoxes checkboxData={interestsSet} name="interests" color="secondary" />
                </div>

                <div className={classes.input}>
                  <FormCheckBoxesWithTitle
                    checkboxData={interestsSet}
                    name="interests"
                    title="Interests"
                    helperText="Choose your interests"
                  />
                </div>

                <div>{JSON.stringify(touched)}</div>
                <div>{JSON.stringify(errors)}</div>
                <div>{JSON.stringify(values.interests)}</div>
                <Divider textAlign="left">Phones</Divider>
                {errors.phones && typeof errors.phones === 'string' && (
                  <Typography variant="subtitle2" gutterBottom color="error" className={classes.input}>
                    {errors.phones}
                  </Typography>
                )}
                <FieldArray
                  name="phones"
                  render={(arrayHelpers) => (
                    <>
                      {values.phones?.map((phone: Phone, index) => (
                        <div key={index}>
                          {/* <Field
                            component={FMTextField}
                            name={`phones[${index}][name]`}
                            label={`Phone ${index + 1} name`}
                            value={phone.name}
                            className={classes.input}
                          /> */}
                          {/* <FormArrayTextFieldN
                            arrayName="phones"
                            name="name"
                            value={phone}
                            index={index}
                            label={`Phone ${index + 1} name`}
                            helperText="enter phone name"
                            className={classes.input}
                          />
                          <FormArrayTextFieldN
                            arrayName="phones"
                            name="number"
                            value={phone}
                            index={index}
                            label={`Phone ${index + 1} number`}
                            // helperText="enter phone name"
                            className={classes.input}
                          /> */}
                          <FormArrayTextField
                            arrayName="phones"
                            name="name"
                            helperText="text"
                            value={phone}
                            index={index}
                            label={`Phone ${index + 1} name`}
                            className={classes.input}
                          />
                          <FormArrayTextField
                            arrayName="phones"
                            name="number"
                            value={phone}
                            index={index}
                            label={`Phone ${index + 1} number`}
                            className={classes.input}
                          />
                          <Button
                            key={'del' + index}
                            variant="text"
                            onClick={() => {
                              arrayHelpers.remove(index);
                            }}
                            size="large"
                            className={classes.deleteButton}
                          >
                            삭제
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outlined"
                        onClick={() => {
                          arrayHelpers.push({ name: '', number: '' });
                        }}
                        size="large"
                        className={classes.input}
                      >
                        전화번호 추가
                      </Button>
                      <Divider />
                    </>
                  )}
                />
                {/* <Button
                  // disabled={!(dirty && isValid)} // 변경이 있고, 에러가 없을때만 submit 버튼 활성화
                  disabled={!dirty} // 변경있을때만 활성화
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.input}
                >
                  Submit
                </Button> */}
                <Button
                  // disabled={!(dirty && isValid)} // 변경이 있고, 에러가 없을때만 submit 버튼 활성화
                  // disabled={!dirty} // 변경있을때만 활성화
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.input}
                  onClick={() => {
                    resetForm();
                  }}
                >
                  Reset
                </Button>
                <SubmitButton className={classes.input} />
              </Form>
            )}
          </Formik>
        </Paper>
      </div>
    </>
  );
  // return (
  //   <>
  //     <div>
  //       <Paper elevation={0}>
  //         {/* <Typography variant="h3" gutterBottom>
  //           Form - Formik & MUI
  //         </Typography> */}
  //         <FormTitle />
  //         <Formik
  //           initialValues={initialValues}
  //           enableReinitialize
  //           validationSchema={validationSchema}
  //           onSubmit={handleSubmit}
  //         >
  //           {({
  //             values: { name, email, password, confirmPassword, phones },
  //             errors,
  //             touched,
  //             handleBlur,
  //             handleChange,
  //             setFieldTouched,
  //             dirty,
  //           }) => (
  //             <Form>
  //               {/* <TextField
  //                 id="name"
  //                 name="name"
  //                 helperText={touched.name ? errors.name : ''}
  //                 error={touched.name && Boolean(errors.name)}
  //                 label="Name"
  //                 value={name}
  //                 onChange={handleChange}
  //                 onBlur={handleBlur}
  //                 fullWidth
  //                 className={classes.input}
  //               /> */}
  //               <FormTextField name="name" label="Name" value={name} fullWidth className={classes.input} />
  //               <TextField
  //                 id="email"
  //                 name="email"
  //                 helperText={touched.email ? errors.email : ''}
  //                 error={touched.email && !!errors.email}
  //                 label="Email"
  //                 fullWidth
  //                 value={email}
  //                 onChange={handleChange}
  //                 onBlur={handleBlur}
  //                 className={classes.input}
  //               />
  //               <TextField
  //                 id="password"
  //                 name="password"
  //                 helperText={
  //                   // with default helper text
  //                   touched.password && errors.password ? errors.password : 'Enter password at least 8 characters'
  //                 }
  //                 error={touched.password && Boolean(errors.password)}
  //                 label="Password"
  //                 fullWidth
  //                 type="password"
  //                 value={password}
  //                 onChange={(e) => {
  //                   handleChange(e);
  //                   setFieldTouched('password', true, false); // touch=true를 통해 해당 항목을 입력하고 있을때 바로 error 표시 가능
  //                 }}
  //                 // onChange={handleChange}
  //                 onBlur={handleBlur} // 이 설정을 통해 blur할때 touched=true 로 설정됨
  //                 className={classes.input}
  //               />
  //               <TextField
  //                 id="confirmPassword"
  //                 name="confirmPassword"
  //                 helperText={touched.confirmPassword ? errors.confirmPassword : ''}
  //                 error={touched.confirmPassword && Boolean(errors.confirmPassword)}
  //                 label="Confirm Password"
  //                 fullWidth
  //                 type="password"
  //                 value={confirmPassword}
  //                 onChange={handleChange}
  //                 onBlur={handleBlur}
  //                 className={classes.input}
  //               />
  //               <div>{JSON.stringify(errors)}</div>
  //               <Divider textAlign="left">Phones</Divider>
  //               {errors.phones && typeof errors.phones === 'string' && (
  //                 <Typography variant="subtitle2" gutterBottom color="error" className={classes.input}>
  //                   {errors.phones}
  //                 </Typography>
  //               )}
  //               <FieldArray
  //                 name="phones"
  //                 render={(arrayHelpers) => (
  //                   <>
  //                     {phones?.map((phone: Phone, index) => (
  //                       <div key={index}>
  //                         {/* <TextField
  //                           id={`phones[${index}].name`}
  //                           name={`phones[${index}].name`}
  //                           helperText={
  //                             touched.phones?.at(index)?.name
  //                               ? (errors.phones?.at(index) as unknown as Phone)?.name
  //                               : ''
  //                           }
  //                           error={
  //                             touched.phones?.at(index)?.name &&
  //                             Boolean((errors.phones?.at(index) as unknown as Phone)?.name)
  //                           }
  //                           label={`Phone ${index + 1} name`}
  //                           value={phone.name}
  //                           onChange={handleChange}
  //                           onBlur={handleBlur}
  //                           className={classes.input}
  //                         /> */}
  //                         <FormArrayTextField
  //                           arrayName="phones"
  //                           name="name"
  //                           index={index}
  //                           label={`Phone ${index + 1} name`}
  //                           value={phone}
  //                           className={classes.input}
  //                         />
  //                         <TextField
  //                           id={`phones[${index}].number`}
  //                           name={`phones[${index}].number`}
  //                           type="number"
  //                           helperText={
  //                             touched.phones?.at(index)?.number
  //                               ? (errors.phones?.at(index) as unknown as Phone)?.number
  //                               : ''
  //                           }
  //                           error={
  //                             touched.phones?.at(index)?.number &&
  //                             Boolean((errors.phones?.at(index) as unknown as Phone)?.number)
  //                           }
  //                           label={`Phone ${index + 1} number`}
  //                           value={phone.number}
  //                           onChange={handleChange}
  //                           onBlur={handleBlur}
  //                           className={classes.input}
  //                         />
  //                         <Button
  //                           key={'del' + index}
  //                           variant="text"
  //                           onClick={() => {
  //                             arrayHelpers.remove(index);
  //                           }}
  //                           size="large"
  //                           className={classes.deleteButton}
  //                         >
  //                           삭제
  //                         </Button>
  //                       </div>
  //                     ))}
  //                     <Button
  //                       variant="outlined"
  //                       onClick={() => {
  //                         arrayHelpers.push({ name: '', number: '' });
  //                       }}
  //                       size="large"
  //                       className={classes.input}
  //                     >
  //                       전화번호 추가
  //                     </Button>
  //                     <Divider />
  //                   </>
  //                 )}
  //               />
  //               <Button
  //                 // disabled={!(dirty && isValid)} // 변경이 있고, 에러가 없을때만 submit 버튼 활성화
  //                 disabled={!dirty} // 변경있을때만 활성화
  //                 type="submit"
  //                 fullWidth
  //                 variant="contained"
  //                 color="primary"
  //                 size="large"
  //                 className={classes.input}
  //               >
  //                 Submit
  //               </Button>
  //               {/* <SubmitButton className={classes.input} /> */}
  //             </Form>
  //           )}
  //         </Formik>
  //       </Paper>
  //     </div>
  //   </>
  // );
});

export default AccountForm;
