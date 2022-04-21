import { observer, Observer } from 'mobx-react-lite';
import { ChangeEvent, useEffect } from 'react';
import { useStore } from '../../contexts/StoreProvider';
import { Typography, Button, Paper, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as yup from 'yup';
import { FastField, Formik, Form, FieldArray, useFormikContext, FormikHelpers, FormikValues } from 'formik';
import _, { initial } from 'lodash';
import { TextField as FMTextField, Checkbox as FMCheckBox, CheckboxWithLabel } from 'formik-mui';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
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
} from '../../components/sample/FormComponents';
import ReCaptchaComponent from '../../components/member/ReCaptchaComponent';

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
}));

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password must contain at least 8 characters').required('Enter your password'),
  confirmPassword: yup
    .string()
    .required('Confirm your password')
    .oneOf([yup.ref('password')], 'Password does not match'),
  phones: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().min(2, 'too short').required('Required'), // these constraints take precedence
        number: yup.number().min(3, 'cmon').required('Required'), // these constraints take precedence
      })
    )
    .required('Must have Phone') // these constraints are shown if and only if inner constraints are satisfied
    .min(1, 'Minimum of 1 phone'),
  interests: yup.array().of(yup.string()).min(1, 'Minimum of 1 interest'),
  // captchaKey: yup.string().min(1).required('Are you a bot?'),
});

// phones 와 같이 2-depth 에 해당하는 데이터가 없는 경우는, 아래를 이용하여 type 정의 가능
// type AccountInfo = yup.InferType<typeof validationSchema>;
interface AccountInfo {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phones: Phone[];
  interests: string[];
  subscription: boolean;
  captchaKey?: string;
}

interface Phone {
  name: string;
  number: number;
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
      disabled={accountStore.loading || !dirty} // 로딩중이 아니고, 변경있을때 활성화
      type="submit"
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

const SubmitButtonForCaptcha = observer((props: { [key: string]: string | object }) => {
  return (
    <Button
      // disabled={accountStore.loading || !dirty} // 로딩중이 아니고, 변경있을때 활성화
      type="submit"
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

const AccountForm = observer(() => {
  const { accountStore } = useStore();
  const classes = useStyles();

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
    // actions.setSubmitting(false); // submit 진행중일때 inactive 방지
    const result = await accountStore.updateApi();
    if (result) {
      actions.resetForm({ values: values }); // submit button 비활성화(dirty reset)를 위해 입력받은 값과 함께 resetForm 처리
    } else {
      // error 표시처리 필요, submit button은 활성화 상태 그대로 남음
    }
  };

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

  return (
    <>
      <div>
        <Paper elevation={0}>
          <FormTitle />
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              // values: { name, email, password, confirmPassword, phones, interests, subscription },
              values,
              errors,
              touched,
              setFieldValue,
              submitCount,
            }) => (
              <Observer>
                {() => (
                  <Form>
                    <FormTextField1
                      disabled={accountStore.loading}
                      name="name"
                      label="Name"
                      fullWidth
                      className={classes.input}
                    />
                    <FormTextField2
                      name="email"
                      label="Email"
                      type="email"
                      error={touched['email'] && !!errors.email} // 입력중일때 error표시가 필요한 경우 (default는 onBlur시 에러 표시됨)
                      fullWidth
                      className={classes.input}
                      disabled={accountStore.loading}
                    />
                    <FormTextField1
                      disabled={accountStore.loading}
                      name="password"
                      label="Password"
                      helperText="Enter at least 2 characters"
                      fullWidth
                      className={classes.input}
                    />
                    <FormTextField2
                      name="confirmPassword"
                      label="Confirm Password"
                      error={touched['confirmPassword'] && !!errors.confirmPassword}
                      fullWidth
                      className={classes.input}
                      disabled={accountStore.loading}
                    />
                    <Divider />
                    <Typography className={classes.input}>Subscription : </Typography>
                    <div>
                      <FormCheckBox1 name="subscription" disabled={accountStore.loading} />
                      <FormCheckBox1
                        name="subscription"
                        disabled={accountStore.loading}
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                      />
                    </div>
                    <div>
                      <FormCheckBox2 name="subscription" disabled={accountStore.loading} />
                      <FormCheckBox2
                        name="subscription"
                        disabled={accountStore.loading}
                        icon={<FavoriteBorder />}
                        checkedIcon={<Favorite />}
                      />
                    </div>

                    <Divider />
                    <FormCheckBoxWithLabel1
                      name="subscription"
                      label="Subscription"
                      className={classes.input}
                      disabled={accountStore.loading}
                    />
                    <FormCheckBoxWithLabel2
                      name="subscription"
                      label="Subscription"
                      className={classes.input}
                      disabled={accountStore.loading}
                    />

                    <Divider />
                    <div className={classes.input}>
                      <FormCheckBoxes2
                        checkboxData={interestsSet}
                        name="interests"
                        color="secondary"
                        disabled={accountStore.loading}
                      />
                    </div>

                    <div className={classes.input}>
                      <FormCheckBoxesWithTitle2
                        checkboxData={interestsSet}
                        name="interests"
                        title="Interests"
                        helperText="Choose your interests"
                        disabled={accountStore.loading}
                      />
                    </div>

                    {/* <div>{JSON.stringify(touched)}</div>
                <div>{JSON.stringify(errors)}</div>
                <div>{JSON.stringify(values.interests)}</div> */}
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
                              {/* <FormArrayTextField2
                            arrayName="phones"
                            name="name"
                            value={phone}
                            index={index}
                            label={`Phone ${index + 1} name`}
                            helperText="enter phone name"
                            className={classes.input}
                          />
                          <FormArrayTextField2
                            arrayName="phones"
                            name="number"
                            value={phone}
                            index={index}
                            label={`Phone ${index + 1} number`}
                            // helperText="enter phone name"
                            className={classes.input}
                          /> */}
                              <FormArrayTextField1
                                disabled={accountStore.loading}
                                arrayName="phones"
                                name="name"
                                helperText="text"
                                value={phone}
                                index={index}
                                label={`Phone ${index + 1} name`}
                                className={classes.input}
                              />
                              <FormArrayTextField1
                                disabled={accountStore.loading}
                                arrayName="phones"
                                name="number"
                                value={phone}
                                index={index}
                                label={`Phone ${index + 1} number`}
                                className={classes.input}
                              />
                              <Button
                                disabled={accountStore.loading}
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
                            disabled={accountStore.loading}
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

                    {/* <ReCaptchaComponent
                      setCaptchaKey={(captchaKey: string) => {
                        setFieldValue('captchaKey', captchaKey);
                      }}
                      showBorder={submitCount > 0 && Boolean(errors.captchaKey)}
                    /> */}

                    <SubmitButton className={classes.input} />
                    <SubmitButtonForCaptcha className={classes.input} />
                  </Form>
                )}
              </Observer>
            )}
          </Formik>
        </Paper>
      </div>
    </>
  );
});

export default AccountForm;
