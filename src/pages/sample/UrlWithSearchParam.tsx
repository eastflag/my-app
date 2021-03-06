import { observer, Observer } from 'mobx-react-lite';
import { useStore } from '../../contexts/StoreProvider';
import { Button, Paper, Switch } from '@mui/material';
import { makeStyles } from '@mui/styles';
import * as yup from 'yup';
import { FastField, Formik, Form, FieldArray, useFormikContext, FormikHelpers, FormikValues } from 'formik';
import { CheckBoxData, FormCheckBox1, FormCheckBoxes2, FormTextField1 } from '../../components/sample/FormComponents';
import useCustomSearchParams, { PARAMS, withDefaultWhenEmptyQueryString } from '../../hooks/useCustomSearchParams';
import TableNumberPagination, { DEFAULT_PER_PAGE_LIST } from '../../components/common/table/TableNumberPagination';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';

/* eslint-disable */
const useStyles = makeStyles(() => ({
  input: {
    margin: '10px',
  },
}));

const validationSchema = yup.object({
  // name: yup.string().required('Name is required'),
  // interests: yup.array().of(yup.string()).min(1, 'Minimum of 1 interest'),
});

interface AccountInfo {
  name: string;
  title?: string;
  subscription?: boolean;
  switch?: boolean;
  interests?: string[];
  size: number;
  page: number;
  sort: string;
}

const SubmitButton = observer((props: { [key: string]: string | object }) => {
  const { urlWithSearchParamStore } = useStore();
  const { dirty } = useFormikContext<FormikValues>();
  const fc = useFormikContext<FormikValues>();

  return (
    <Button
      disabled={urlWithSearchParamStore.loading || !dirty}
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

/** Uses a comma to delimit entries. e.g. ['a', 'b'] => qp?=a,b */
const UrlWithSearchParam = observer(() => {
  const { urlWithSearchParamStore } = useStore();
  const params = useParams();
  const classes = useStyles();
  const location = useLocation();

  const { searchParams, setSearchParams, setSearchParam } = useCustomSearchParams(
    {
      name: withDefaultWhenEmptyQueryString(PARAMS.StringParam, '??????'),
      title: withDefaultWhenEmptyQueryString(PARAMS.NumberParam, 2),
      switch: PARAMS.BooleanParam,

      // ?????? ????????? ????????? ?????? query string ??? ?????????, ?????? ????????? ????????? ?????????,
      // ????????? ?????? withDefaultWhenEmptyQueryString() ????????? ???????????? ????????? ??????
      interests: withDefaultWhenEmptyQueryString(PARAMS.ArrayParam, ['game', 'sport', 'book']),

      // pagination??? ?????????????????? ?????? query string??? ????????????,
      // page size list?????? ????????? ????????? ????????? ( custom hook?????? ???????????? ????????? ????????? ???????????? ?????? ?????? )
      size: PARAMS.NumberParam,
      page: PARAMS.NumberParam,
      sort: PARAMS.StringParam,
    }
    // [50,100,200] // optional param ??? pagination?????? ????????? page size??? ????????? ?????? ??????
  );

  useEffect(() => {
    console.log('initiall rendering');
  }, []);

  console.log(params);

  const initialValues: AccountInfo = {
    name: searchParams.name,
    title: searchParams.title ?? '',
    switch: searchParams.switch,
    interests: searchParams.interests ?? [],
    size: searchParams.size ?? 10,
    page: searchParams.page ?? 1,
    sort: searchParams.sort ?? '',
  };
  console.log('searchParams.size');
  console.log(searchParams.size);
  console.log('searchParams.page');
  console.log(searchParams.page);
  console.log(params);

  // url ????????? ???????????? BE ??????????????? ??????
  useEffect(() => {
    urlWithSearchParamStore.fetchApi(initialValues);
  }, [location.key]);

  const handleSubmit = async (values: AccountInfo, actions: FormikHelpers<AccountInfo>) => {
    // console.log(JSON.parse(JSON.stringify(values, null, 2)));

    setSearchParams(values);

    // url query string?????? ????????? ?????? submit ????????? BE API ??? ???????????? ??????, query string ????????? ?????????
    // ??? useEffect??? ?????? query string ????????? ????????????,
    // Formik initialValue??? BE ??????

    // await urlWithSearchParamStore.fetchApi(values);
    // actions.resetForm({ values: values });
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
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue, submitCount, submitForm, handleChange }) => (
              <Observer>
                {() => (
                  <Form>
                    <FormTextField1
                      disabled={urlWithSearchParamStore.loading}
                      name="name"
                      label="Name"
                      fullWidth
                      className={classes.input}
                    />
                    <FormTextField1
                      disabled={urlWithSearchParamStore.loading}
                      name="title"
                      label="Title"
                      fullWidth
                      className={classes.input}
                      type={'number'}
                    />
                    <Switch name="switch" value={values.switch} checked={values.switch} onChange={handleChange} />
                    <div className={classes.input}>
                      <FormCheckBoxes2
                        checkboxData={interestsSet}
                        name="interests"
                        color="secondary"
                        disabled={urlWithSearchParamStore.loading}
                      />
                    </div>
                    <TableNumberPagination
                      disabled={urlWithSearchParamStore.loading}
                      totalElements={urlWithSearchParamStore.totalElements}
                      totalPages={urlWithSearchParamStore.totalPages}
                    />
                    <SubmitButton className={classes.input} />
                    <Button
                      variant="contained"
                      onClick={() => {
                        // setSearchParam('sort', 'name,asc');
                        setFieldValue('sort', 'name,asc');
                        submitForm();
                      }}
                    >
                      Add sort condition
                    </Button>
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

export default UrlWithSearchParam;
