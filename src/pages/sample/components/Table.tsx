import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Typography, TableContainer, Table, TableRow, TableCell, TableBody, Box } from '@mui/material';

import TableHeader, { TableHeadCell } from '../../../components/common/table/TableHeader';
import CustomItemDetail from '../../../components/common/custom/CustomItemDetail';
import { getLocalDatetime } from '../../../utils/FormatUtils';
import TableNoResult from '../../../components/common/table/TableNoResult';
import TableNumberPagination from '../../../components/common/table/TableNumberPagination';
import { Form, Formik } from 'formik';
import Spacer from '../../../components/common/Spacer';
import TableLinkCell from '../../../components/common/table/TableLinkCell';
import TableClickableRow from '../../../components/common/table/TableClickableRow';
import { useNavigate } from 'react-router-dom';
import { Theme } from '@mui/system';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  displayGrid: {
    display: 'inline-grid',
  },
  textContainer: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const TableSample = observer(() => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const classes = useStyles();

  interface HeaderData {
    name: string;
    chainType: string;
    nftType: string;
    nftSupply: string;
    lastUpdateDatetime: string;
  }

  const headCells: TableHeadCell<HeaderData>[] = [
    {
      id: 'name',
      label: 'Name',
      sortable: false,
    },
    {
      id: 'chainType',
      label: 'Block Chain',
      width: '15%',
    },
    {
      id: 'nftType',
      label: 'Nft Type',
      width: '15%',
    },
    {
      id: 'nftSupply',
      label: 'Nft Supply',
      width: '150px',
      numeric: true,
    },
    {
      id: 'lastUpdateDatetime',
      label: 'Last Update',
      width: '15%',
    },
  ];

  function createData(
    id: string,
    name: string,
    subName: string,
    chainType: string,
    nftType: string,
    nftSupply: number,
    thumbNailSignedUrl: string,
    lastUpdateDatetime: string
  ) {
    return { id, name, subName, chainType, nftType, nftSupply, thumbNailSignedUrl, lastUpdateDatetime };
  }

  const rows = [
    createData(
      '1',
      'Nft Name1',
      '',
      'Ethereum',
      'Unique',
      1,
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      '2022-04-11T07:51:48Z'
    ),
    createData('2', 'Nft Name2', 'collection name', 'Ethereum', 'Unique', 1, '', '2022-04-11T07:51:48Z'),
    createData(
      '3',
      'Nft Name3',
      '',
      'Ethereum',
      'Edition',
      0,
      'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      '2022-04-11T07:51:48Z'
    ),
    createData(
      '4',
      'Nft Name4_임시_길다_Nft Name4_임시_길다_Nft Name4_임시_길다_Nft Name4_임시_길다_Nft Name4_임시_길다_Nft Name4_임시_길다',
      'collection name',
      'Solana',
      'Unique',
      3,
      '',
      '2022-04-11T07:51:48Z'
    ),
  ];

  return (
    <>
      <Spacer y={5} />
      <Typography variant="h4">Table</Typography>
      <Formik
        initialValues={{ size: 10, page: 1, sort: 'lastUpdateDatetime,DESC' }}
        onSubmit={(values) => {
          const t = JSON.stringify(values, null, 2);
          console.log(t);
        }}
      >
        {() => (
          <Form name="tableForm">
            <Spacer y={3} />
            <Typography variant="h6">Table - With CustomItemDetail Component / Pagination / Table Cell Link</Typography>
            <TableContainer>
              <Table>
                <TableHeader headCells={headCells} disabled={loading}></TableHeader>
                <TableBody>
                  {rows.map((info) => (
                    <TableRow key={info.id} hover>
                      <TableLinkCell to={'/sample/components/filter'}>
                        <CustomItemDetail
                          name={info.name}
                          subName={info.subName}
                          thumbNailUrl={info.thumbNailSignedUrl}
                        ></CustomItemDetail>
                      </TableLinkCell>
                      <TableCell>{info.chainType}</TableCell>
                      <TableCell>{info.nftType}</TableCell>
                      <TableCell align={'right'}>{info.nftSupply}</TableCell>
                      <TableCell>{getLocalDatetime(info.lastUpdateDatetime, 'toSecond')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TableNumberPagination disabled={loading} totalPages={1} totalElements={1} />

            <Typography variant="h6">Table - Row Click </Typography>
            <TableContainer>
              <Table>
                <TableHeader headCells={headCells} disabled={loading} sortChangeSubmit={false}></TableHeader>
                <TableBody>
                  {rows.map((info) => (
                    <TableClickableRow
                      key={info.id}
                      hover
                      onClick={() => {
                        navigate('/sample/components/filter');
                      }}
                    >
                      <TableCell>
                        <Box className={classes.displayGrid}>
                          <Typography variant="body2" className={classes.textContainer}>
                            {info.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{info.chainType}</TableCell>
                      <TableCell>{info.nftType}</TableCell>
                      <TableCell align={'right'}>{info.nftSupply}</TableCell>
                      <TableCell>{getLocalDatetime(info.lastUpdateDatetime, 'toSecond')}</TableCell>
                    </TableClickableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Spacer y={3} />
            <Typography variant="h6">Table - No Result</Typography>
            <TableContainer>
              <Table>
                <TableHeader headCells={headCells} disabled={loading} sortChangeSubmit={false}></TableHeader>
                <TableBody>
                  <TableNoResult colSpan={5} />
                </TableBody>
              </Table>
            </TableContainer>
            <Spacer y={3} />
          </Form>
        )}
      </Formik>
    </>
  );
});

export default TableSample;
