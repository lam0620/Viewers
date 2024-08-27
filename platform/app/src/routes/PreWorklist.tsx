import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSearchParams } from "@hooks";
import Cookies from "js-cookie";

// Add this in index.tsx
/*
const bakedInRoutes = [
  {
    path: '/toworklists',
    children: ToWorklist,
  },
 */

const PreWorklist = ({
  message = 'Unable to query for studies at this time. Check your data source configuration or network connection',
}) => {
  const navigate = useNavigate();
  // Get query params
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("key")
    const refreshToken = searchParams.get("ref")
    // const startDate = searchParams.get("startDate")

    // Remove key and ref from url
    if (searchParams.has('key')) {
      searchParams.delete('key');
    }
    if (searchParams.has('ref')) {
      searchParams.delete('ref');
    }
    console.log(`key = ${accessToken}`)
    console.log(`searchParams = ${searchParams.toString()}`)

    // Cookies.set("access_token", accessToken, { expires: 1 });
    // Cookies.set("refresh_token", refreshToken, { expires: 7 });
    // axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    console.log("Cookie.at:"+Cookies.get("access_token"));
    navigate(`/?${searchParams.toString()}`, '_self');
  }, []);

  return (
    <div className="absolute flex h-full w-full items-center justify-center text-white">
      In progress...
    </div>
  );
};

PreWorklist.propTypes = {
  message: PropTypes.string,
};

export default PreWorklist;
