import moment from 'moment';
import v5 from 'uuid/v5';

export const generateProjectLink = (projectId: string | number) => {
  const date = moment.utc().format('LL')
  const link = v5(`${projectId}-${date}`, v5.URL);
  return `${process.env.CLIENT_URL}/invite/project/public?project=${projectId}&id=${link}`;
}