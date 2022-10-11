import {Fragment, useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import {getCultureIDAutocompleteData} from "../utils/apis";
function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export default function AutoCompleteCultureId({setSelectedAccount}) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountId, setAccountId] = useState("");

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      if (active) {
        setLoading(true);
        let result = inputValue && (await getCultureIDAutocompleteData(inputValue));
        if (result && result.length > 0) {
          setOptions([...result]);
          setLoading(false);
        } else {
          setLoading(false);
          setOptions([]);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <>
      <div className="left">
        <h4>Start new Conversation:)</h4>
        <div style={{marginTop: "6px", padding: "2px"}}>
          <Autocomplete
            id="asynchronous-demo"
            sx={{width: 300}}
            open={open}
            onOpen={() => {
              setOpen(true);
            }}
            onClose={() => {
              setOptions([]);
              setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.CULTURE_ID === value.CULTURE_ID}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setLoading(true);
              setInputValue(newInputValue);
            }}
            onChange={(event, value) => setSelectedAccount(value)}
            getOptionLabel={(option) => option.CULTURE_ID}
            options={options}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Culture ID"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <Fragment>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </Fragment>
                  ),
                }}
              />
            )}
          />
        </div>
      </div>
    </>
  );
}
