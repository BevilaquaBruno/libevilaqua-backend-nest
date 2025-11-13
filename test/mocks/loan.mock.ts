import * as moment from 'moment';

const currentDate = moment();

export var loan1 = {
  id: 1,
  description: 'Descrição do empréstimo 1',
  return_date: null,
  must_return_date: currentDate.add('5M').format('YYYY-MM-DD'),
  loan_date: currentDate.format('YYYY-MM-DD'),
  bookId: 1,
  personId: 1,
};

export var loan2 = {
  id: 1,
  description: 'Descrição do empréstimo 2',
  return_date: currentDate.add('1D').format('YYYY-MM-DD'),
  must_return_date: currentDate.add('5M').format('YYYY-MM-DD'),
  loan_date: currentDate.format('YYYY-MM-DD'),
  bookId: 2,
  personId: 2,
};
