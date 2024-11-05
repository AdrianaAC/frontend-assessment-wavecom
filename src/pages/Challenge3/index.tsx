import { useEffect, useState } from "react";

const getRandomNumberApi = new Promise<number>((resolve) => {
  // simuate delay
  setTimeout(() => {
    fetch(
      "https://corsproxy.io/?" +
        encodeURIComponent(
          "https://www.randomnumberapi.com/api/v1.0/randomnumber"
        )
    )
      .then((d) => d.json())
      .then((d) => resolve(d[0]));
  }, 1000);
});

function Challenge3() {
  const [randomApi, setRandomApi] = useState(0);

  useEffect(() => {
    setInterval(() => {
      getRandomNumberApi.then((num) => {
        setRandomApi(num);
      });
    }, 1000);
  });

  return (
    <>
      There is an api recurrent request simulation on this page, and this state
      is not updating, we want to keep the promise so that it can scale and do
      more work
      <br />
      {randomApi}
    </>
  );
}

export default Challenge3;