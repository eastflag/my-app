import { Box, Button, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { Observer, observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormFilterButton, FormFilterSelect } from '../../../components/common/form/FormFilter';
import { FormTextField } from '../../../components/common/form/FormTextField';
import Spacer from '../../../components/common/Spacer';

const validationSchema = yup.object({
  status: yup.array().min(2, 'should over 2'),
  aa: yup.string().min(5, 'aaa'),
});

const initialValue = {};

const FilterButtonSample = observer(() => {
  const [text, setText] = useState<string>('');

  const [option, setOption] = useState<[string, string][]>([]);

  useEffect(() => {
    setTimeout(() => {
      setOption([
        ['unique', '유니크'],
        ['edition', '에디션'],
        ['generative', '제너러티브'],
      ]);
    }, 3000);
  }, []);

  return (
    <>
      <Spacer y={5} />
      <Formik
        initialValues={initialValue}
        onSubmit={(values) => {
          const t = JSON.stringify(values, null, 2);
          console.log(t);
          setText(t);
        }}
        enableReinitialize
        validationSchema={validationSchema}
      >
        {() => (
          <Observer>
            {() => (
              <Form>
                <Box display={'flex'}>
                  <FormFilterButton
                    selectOptions={[
                      ['minRequested', 'Mint Requested'],
                      ['mintRefused', 'Mint Refused'],
                      ['minted', 'Minted'],
                      ['sold', 'Sold'],
                    ]}
                    buttonText={'Status - Yup'}
                    name={'status'}
                    showHelperText
                  />
                  <Spacer x={1} />
                  <FormFilterButton
                    selectOptions={[
                      ['ethereum', 'Ethereum'],
                      ['solana', 'Solana'],
                    ]}
                    buttonText={'Block Chain - label'}
                    name={'blockChain'}
                  />
                  <Spacer x={1} />
                  <FormFilterButton
                    selectOptions={[
                      ['unique', 'Unique'],
                      ['edition', 'Edition'],
                      ['generative', 'Generative'],
                    ]}
                    buttonText={'Disabled'}
                    name={'nftType'}
                    disabled
                  />
                  <Spacer x={1} />
                  <FormFilterButton
                    selectOptions={[
                      ['unique', 'Unique'],
                      ['edition', 'Edition'],
                      ['generative', 'Generative'],
                    ]}
                    error
                    buttonText={'NFT Type2'}
                    name={'nftType2'}
                  />
                  <Spacer x={1} />
                  <FormFilterButton
                    selectOptions={[
                      ['unique', 'Unique'],
                      ['edition', 'Edition'],
                      ['generative', 'Generative'],
                    ]}
                    buttonText={'NFT Type2 Synced'}
                    name={'nftType2'}
                  />
                  <Spacer x={1} />
                  <FormFilterButton
                    selectOptions={[
                      ['unique', 'Unique'],
                      ['edition', 'Edition'],
                      ['generative', 'Generative'],
                    ]}
                    buttonText={'Submit After Change'}
                    name={'nftType3'}
                    submitAfterChange
                  />
                  <Spacer x={1} />
                  <FormFilterButton
                    selectOptions={[
                      ['unique', 'Unique'],
                      ['edition', 'Edition'],
                      ['generative', 'Generative'],
                    ]}
                    buttonText={'show helper text'}
                    name={'nftType4'}
                    showHelperText={true}
                    helperText={'helper text'}
                  />
                  <Spacer x={1} />
                </Box>
                <FormTextField label="Search Project Name" name="aa" type="text" />

                <Spacer y={4} />
                <Typography variant="h4">Type</Typography>
                <Spacer y={2} />
                <Box display={'flex'}>
                  <FormFilterButton
                    name={'nftType10'}
                    selectOptions={option}
                    allSelectLabel={'전체선택'}
                    SelectProps={{
                      sx: {
                        width: '220px',
                      },
                    }}
                    buttonText={'FormFilterButton'}
                    showHelperText
                    helperText={'FormFilterButton'}
                  />
                  <Spacer x={1} />
                  <FormFilterSelect
                    name={'nftType10'}
                    selectOptions={option}
                    label={'상태'}
                    allSelectLabel={'전체선택'}
                    SelectProps={{
                      sx: {
                        width: '220px',
                      },
                    }}
                    showHelperText
                    helperText={'FormFilterSelect'}
                  />
                  <Spacer x={1} />
                </Box>

                <Spacer y={4} />
                <Typography variant="h4">render value</Typography>
                <Spacer y={2} />
                <Box display={'flex'}>
                  <FormFilterButton
                    name={'nftType9'}
                    selectOptions={option}
                    buttonText={'Selected'}
                    allSelectLabel={'전체선택'}
                    SelectProps={{
                      sx: {
                        width: '220px',
                      },
                    }}
                    showHelperText
                    helperText={'button'}
                  />
                  <Spacer x={1} />
                  <FormFilterSelect
                    name={'nftType9'}
                    selectOptions={option}
                    label={'상태'}
                    allSelectLabel={'전체선택'}
                    SelectProps={{
                      sx: {
                        width: '220px',
                      },
                    }}
                    showHelperText
                    helperText={'select'}
                  />
                </Box>

                <Button type="submit">submit</Button>
              </Form>
            )}
          </Observer>
        )}
      </Formik>
      <Spacer y={5} />
      <Typography variant="body1">{text}</Typography>
    </>
  );
});

export default FilterButtonSample;
