import React from "react";
import "../styles/Analytics.css";
import { SlCalender } from "react-icons/sl";
import { useState, useEffect } from "react";
import { GoSettings } from "react-icons/go";
import { FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import app_logo from "../assets/app_logo.png";

export default function Analytics() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [dateInp, setDateInp] = useState(false);
  const [startDate, setStartDate] = useState("2021-06-01");
  const [endDate, setEndDate] = useState("2021-06-10");
  const [dateString, setDateString] = useState("Jun 01-Jun 10 2021");
  const [arr, setArr] = useState([""]);
  const [apps, setApps] = useState([""]);
  const [showLink, setShowLink] = useState(false);
  const [searchParams] = useSearchParams();

  const dash = {
    Date: false,
    App: false,
    "Ad Requests": false,
    "Ad Response": false,
    Impressions: false,
    Clicks: false,
    Revenue: false,
    "Fill Rate": false,
    CTR: false,
  };
  const map = {
    Date: "date",
    App: "app_id",
    "Ad Requests": "requests",
    "Ad Response": "responses",
    Impressions: "impressions",
    Clicks: "clicks",
    Revenue: "revenue",
    "Fill Rate": "fill_rate",
    CTR: "ctr",
  };
  const dashArr = [
    "Date",
    "App",
    "Ad Requests",
    "Ad Response",
    "Impressions",
    "Clicks",
    "Revenue",
    "Fill Rate",
    "CTR",
  ];

  const [dashItems, setDashItems] = useState(dash);
  const [link, setLink] = useState("");

  useEffect(() => {
    axios
      .get(
        "http://go-dev.greedygame.com/v3/dummy/report?startDate=" +
          startDate +
          "&endDate=" +
          endDate
      )
      .then((res) => {
        const tempArr = res.data.data;
        for (let i = 0; i < tempArr.length; i++) {
          tempArr[i].fill_rate =
            (tempArr[i].requests / tempArr[i].responses) * 100;
          tempArr[i].ctr = (tempArr[i].clicks / tempArr[i].impressions) * 100;
        }
        setArr(tempArr);
      });
    axios.get("http://go-dev.greedygame.com/v3/dummy/apps").then((res) => {
      setApps(res.data.data);
    });
    if(searchParams.get("start") && searchParams.get("end") && searchParams.get("dash")){

    setStartDate(searchParams.get("start"));
    setEndDate(searchParams.get("end"));
    const start = new Date(searchParams.get("start")).toDateString().split(" ");
    const end = new Date(searchParams.get("end")).toDateString().split(" ");
    const val =
      start[1] + " " + start[2] + "-" + end[1] + " " + end[2] + ", " + end[3];
    setDateString(val);
    const active = JSON.parse(searchParams.get("dash"));
    console.log(active);
    let tempItems = dashItems;
    active.map((i) => {
      tempItems[i] = true;
    });
    setDashItems(tempItems)
  }
}, []);

  const sumArray = (field) => {
    let sum = 0;
    arr.map((obj) => {
      sum += obj[field];
    });
    return sum;
  };

  const getLink = () => {
    const newArray = dashArr.filter((item) => {
      return dashItems[item];
    });
    const u =
      "http://localhost:3000/analytics?start=" +
      startDate +
      "&end=" +
      endDate +
      "&dash=" +
      JSON.stringify(newArray);
    setLink(u);
    setShowLink(true);
  };

  return (
    <div>
      <div className="leftBar"></div>
      <div className="mainBox">
        <div className="title">Analytics</div>
        <div>
          <button className="dateBox" onClick={() => setDateInp(true)}>
            <SlCalender className="calenderIcon" /> {dateString}
          </button>
          {dateInp && (
            <div className="dateInput">
              <div className="dInpRow">
                Start Date: &nbsp;
                <input
                  type={"date"}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="dInpRow">
                End Date: &nbsp;
                <input
                  type={"date"}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <button
                className="submit"
                onClick={() => {
                  setDateInp(false);
                  const start = new Date(startDate).toDateString().split(" ");
                  const end = new Date(endDate).toDateString().split(" ");
                  const val =
                    start[1] +
                    " " +
                    start[2] +
                    "-" +
                    end[1] +
                    " " +
                    end[2] +
                    ", " +
                    end[3];
                  setDateString(val);
                  axios
                    .get(
                      "http://go-dev.greedygame.com/v3/dummy/report?startDate=" +
                        startDate +
                        "&endDate=" +
                        endDate
                    )
                    .then((res) => {
                      const tempArr = res.data.data;
                      for (let i = 0; i < tempArr.length; i++) {
                        tempArr[i].fill_rate =
                          (tempArr[i].requests / tempArr[i].responses) * 100;
                        tempArr[i].ctr =
                          (tempArr[i].clicks / tempArr[i].impressions) * 100;
                      }
                      setArr(tempArr);
                    });
                }}
              >
                Submit
              </button>
            </div>
          )}
          <button className="dateBox" onClick={() => getLink()}>
            Get Shareable Link
          </button>
          {dashItems && showLink && (
            <>
              <input className="linkInp" value={link} />{" "}
              <button className="dateBox2" onClick={() => setShowLink(false)}>
                Close
              </button>
            </>
          )}
          <button
            className="settingsBtn"
            onClick={() => setShowDashboard(true)}
          >
            <GoSettings className="calenderIcon" /> Settings
          </button>
        </div>
        {showDashboard && (
          <div className="dashboard">
            <div>Dashboard and Metrics</div>
            <div>
              {Object.keys(dashItems).map((keyName, i) => (
                <>
                  <button
                    className="dash_btn"
                    id={dashItems[keyName] ? "dash_selected" : null}
                    onClick={() => {
                      const val = dashItems[keyName];
                      setDashItems({
                        ...dashItems,
                        [keyName]: !dashItems[keyName],
                      });
                    }}
                  >
                    {keyName}
                  </button>
                </>
              ))}
            </div>
            <button className="c_dash" onClick={() => setShowDashboard(false)}>
              Close
            </button>
          </div>
        )}
        <div>
          <div className="table">
            {dashArr.map((item) => (
              <>
                {dashItems[item] && (
                  <div className="table_col">
                    <div>
                      <FaFilter />
                    </div>
                    <div>{item}</div>
                    <div className="table_header">
                      {item == "Date" ? (
                        <>
                          {(new Date(endDate) - new Date(startDate)) /
                            (1000 * 60 * 60 * 24) +
                            1}
                        </>
                      ) : item == "App" ? (
                        <>{arr.length}</>
                      ) : item == "Ad Requests" ||
                        (item == "Ad Response") |
                          (item == "Impressions") |
                          (item == "Clicks") ? (
                        <>{(sumArray(map[item]) / 1000000).toFixed(2)}M</>
                      ) : item == "Revenue" ? (
                        <>${(sumArray(map[item]) / arr.length).toFixed(2)}K</>
                      ) : (
                        <>{(sumArray(map[item]) / arr.length).toFixed(2)}%</>
                      )}
                    </div>
                    <div>
                      {arr ? (
                        <>
                          {item == "Date" ? (
                            <>
                              {arr.map((arrItem) => (
                                <div className="tRow">
                                  {new Date(arrItem.date)
                                    .toDateString()
                                    .slice(3)}
                                </div>
                              ))}
                            </>
                          ) : item == "App" ? (
                            <>
                              {arr.map((arrItem) => (
                                <div className="tRow">
                                  {apps.map((app) =>
                                    app.app_id == arrItem[map[item]] ? (
                                      <>
                                        <img
                                          className="app-logo"
                                          src={app_logo}
                                        />
                                        {app.app_name}
                                      </>
                                    ) : null
                                  )}
                                </div>
                              ))}
                            </>
                          ) : (
                            <>
                              {item == "Revenue" ? (
                                <>
                                  {arr.map((arrItem) => (
                                    <div className="tRow">
                                      ${arrItem[map[item]].toFixed(2)}
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <>
                                  {item == "CTR" || item == "Fill Rate" ? (
                                    <>
                                      {" "}
                                      {arr.map((arrItem) => (
                                        <div className="tRow">
                                          {arrItem[map[item]]}%
                                        </div>
                                      ))}
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      {arr.map((arrItem) => (
                                        <div className="tRow">
                                          {arrItem[map[item]]}
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>{" "}
      </div>
    </div>
  );
}
