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
      name: withDefaultWhenEmptyQueryString(PARAMS.StringParam, 'ㄴㄴ'),
      title: withDefaultWhenEmptyQueryString(PARAMS.NumberParam, 2),
      switch: PARAMS.BooleanParam,

      // 최초 페이지 진입과 같이 query string 이 없는데, 기본 설정이 필요한 값들은,
      // 아래와 같이 withDefaultWhenEmptyQueryString() 함수를 이용해서 기본값 설정
      interests: withDefaultWhenEmptyQueryString(PARAMS.ArrayParam, ['game', 'sport', 'book']),

      // pagination에 정의되지않은 값을 query string에 입력하면,
      // page size list에서 첫번째 값으로 설정됨 ( custom hook에서 자동처리 하므로 별도로 소스작업 필요 없음 )
      size: PARAMS.NumberParam,
      page: PARAMS.NumberParam,
      sort: PARAMS.StringParam,
    }
    // [50,100,200] // optional param 로 pagination에서 사용할 page size를 별도로 줄수 있음
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

  // url 변경이 감지될때 BE 호출하도록 설정
  useEffect(() => {
    urlWithSearchParamStore.fetchApi(initialValues);
  }, [location.key]);

  const handleSubmit = async (values: AccountInfo, actions: FormikHelpers<AccountInfo>) => {
    // console.log(JSON.parse(JSON.stringify(values, null, 2)));

    setSearchParams(values);

    // url query string과의 연동을 위해 submit 버튼시 BE API 를 호출하지 않고, query string 변경만 처리함
    // 위 useEffect를 통해 query string 변경을 감지해서,
    // Formik initialValue로 BE 호출

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
