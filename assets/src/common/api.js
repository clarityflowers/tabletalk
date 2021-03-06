import * as api from "./baseApi";
import { forAuth } from "state";

const catchStatus = error => dispatch => {
  if (error.response.status === 503) {
    dispatch(forAuth.setStatusUnknown({ value: true }));
  } else {
    throw error;
  }
};

export const get = (url, { queries, baseUrl = "api" } = {}) => dispatch => {
  return dispatch(api.get(`${baseUrl}/${url}`, { queries })).catch(err =>
    dispatch(catchStatus(err))
  );
};

export const post = (
  url,
  body,
  { queries, baseUrl = "api" } = {}
) => dispatch => {
  return dispatch(api.post(`${baseUrl}/${url}`, { queries, body })).catch(err =>
    dispatch(catchStatus(err))
  );
};
