import { Button, Container, Paper, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { Observer } from 'mobx-react-lite';
import { useState } from 'react';
import * as yup from 'yup';
import FormSelectField from '../../components/common/form/FormSelectField';
import Spacer from '../../components/common/Spacer';

const validationSchema = yup.object({
  'select-two': yup.array().min(2, 'should select more than 2 items'),
});
const FormSelectorSample = () => {
  const [valueOne, setValueOne] = useState({});
  const [valueTwo, setValueTwo] = useState({ 'select-two': ['aa'] });

  return (
    <Container>
      <Spacer y={5} />
      <Typography variant="h4">Form Select</Typography>
      <Paper elevation={5}>
        <Formik
          initialValues={valueOne}
          onSubmit={(values) => {
            console.log(values);
            setValueOne(values);
          }}
        >
          {() => (
            <Observer>
              {() => (
                <Form>
                  <FormSelectField
                    name="select"
                    options={[
                      ['aa', 'AA'],
                      ['bb', 'BB'],
                      ['cc', 'CC'],
                      ['dd', 'DD'],
                    ]}
                  />
                  <FormSelectField
                    name="select"
                    error
                    options={[
                      ['aa', 'AA'],
                      ['bb', 'BB'],
                      ['cc', 'CC'],
                      ['dd', 'DD'],
                    ]}
                  />
                  <FormSelectField
                    name="select"
                    disabled
                    options={[
                      ['aa', 'AA'],
                      ['bb', 'BB'],
                      ['cc', 'CC'],
                      ['dd', 'DD'],
                    ]}
                  />
                  <FormSelectField
                    name="select"
                    showLabel
                    label="label"
                    options={[
                      ['aa', 'AA'],
                      ['bb', 'BB'],
                      ['cc', 'CC'],
                      ['dd', 'DD'],
                    ]}
                  />
                  <Button type="submit">Submit</Button>
                </Form>
              )}
            </Observer>
          )}
        </Formik>
        <Typography variant="body1">{JSON.stringify(valueOne)}</Typography>
      </Paper>
      <Spacer y={2} />
      <Paper elevation={5}>
        <Formik
          initialValues={valueTwo}
          onSubmit={(values) => {
            console.log(values);
            setValueTwo(values);
          }}
          validationSchema={validationSchema}
        >
          {() => (
            <Observer>
              {() => (
                <Form>
                  <FormSelectField
                    name="select-two"
                    multiple
                    options={[
                      ['aa', 'AA'],
                      ['bb', 'BB'],
                      ['cc', 'CC'],
                      ['dd', 'DD'],
                    ]}
                  />
                  <FormSelectField
                    name="select-two"
                    multiple
                    showHelperText
                    options={[
                      ['aa', 'AA'],
                      ['bb', 'BB'],
                      ['cc', 'CC'],
                      ['dd', 'DD'],
                    ]}
                  />
                  <FormSelectField
                    name="select-two"
                    multiple
                    showHelperText
                    helperText="helperText"
                    options={[
                      ['aa', 'AA'],
                      ['bb', 'BB'],
                      ['cc', 'CC'],
                      ['dd', 'DD'],
                    ]}
                  />
                  <Button type="submit">Submit</Button>
                </Form>
              )}
            </Observer>
          )}
        </Formik>
        <Typography variant="body1">{JSON.stringify(valueTwo)}</Typography>
      </Paper>
    </Container>
  );
};

export default FormSelectorSample;
