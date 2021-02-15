import React from "react";
import {CircularProgress} from "@material-ui/core";
import {toAbsoluteUrl} from "../../_helpers";

export function SplashScreen() {
  return (
    <>
      <div className="splash-screen">
        <h1>Data Pure</h1>
        <CircularProgress className="splash-screen-spinner" />
      </div>
    </>
  );
}
