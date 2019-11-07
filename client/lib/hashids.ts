import Hashids from 'hashids/cjs';


export const hashids = new Hashids('Taskr', 10)
export const encode = (id: string | number) => {
  if (typeof id === 'string') {
    return hashids.encode(parseInt(id, 10))
  } else {
    return hashids.encode(id)
  }
}
export const decode = (id: string) => hashids.decode(id)[0].toString();
