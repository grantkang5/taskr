import Hashids from 'hashids'

export const hashids = new Hashids(process.env.ACCESS_TOKEN_SECRET)