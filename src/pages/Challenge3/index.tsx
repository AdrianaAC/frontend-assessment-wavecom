import { useEffect, useState } from "react";
import "./index.css";

const RANDOM_NUMBER_URL =
  "https://corsproxy.io/?" +
  encodeURIComponent("https://www.randomnumberapi.com/api/v1.0/randomnumber");

async function getRandomNumberApi(timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(RANDOM_NUMBER_URL, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Random number API failed with status ${response.status}`);
    }

    const data = (await response.json()) as number[];
    return data[0];
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function Challenge3() {
  const [randomApi, setRandomApi] = useState<number | null>(null);

  useEffect(() => {
    let isActive = true;
    let timeoutId: number | undefined;

    const pollRandomNumber = async () => {
      try {
        const nextNumber = await getRandomNumberApi();
        if (isActive) {
          setRandomApi(nextNumber);
        }
      } catch (error) {
        if (isActive) {
          console.error("Error fetching random number:", error);
        }
      } finally {
        if (isActive) {
          timeoutId = window.setTimeout(pollRandomNumber, 1000);
        }
      }
    };

    pollRandomNumber();

    return () => {
      isActive = false;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <>
      <div className="solutionContainer">
        <h4 className="solutionH4">Problem resumed: </h4>
        <p className="solutionP">
          The function getRandomNumberApi() is defined as a single instance of a
          promise - a static promise. This function, as configured, is only
          executed once and always returns a single value, leading to, when its
          called repeatedly by setInterval, it does not fetch new data, it just
          returns the same initial result from the promise. The useEffect field
          als does not "cleans" the promise, so the interval keeps running,
          which may lead to memory leaks. In order to prepare for future
          scaling, we also need to re-design the promise, so its not a static
          promise anymore.
        </p>
        <hr className="brSolution" />
        <h4 className="solutionH4">Solution presented: </h4>
        <p className="solutionP">
          By refactoring getRandomNumberApi into a function we get a api request
          and a returning promise for each time this function is called, thous
          allowing a real-time update for randomApi. By adding a .catch block,
          and logging the error in this situation, we are able to unsure
          scalability of the code. In useEffect, we made sure there theres a
          cleaning process when the component unmounts.
        </p>
        <hr className="brSolution" />
        <h4 className="solutionH4">How to test: </h4>
        <p className="solutionP">
          Run the app, on tab Challenge 3 check the number provided. This number
          should be updated in a real-time basis, around 1 second. For issues
          and error handling, you can now check the console for any error
          messages.
        </p>
      </div>
      There is an API recurrent request simulation on this page, and this state
      is not updating. We want to keep the promise structure flexible so that it
      can scale and do more work in the future.
      <br />
      {randomApi ?? "Loading..."}
    </>
  );
}

export default Challenge3;
