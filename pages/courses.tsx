import React from "react";
import NewHeader from "../components/Layout";

export default function Courses() {
  const [isCalculate, setIsCalculate] = React.useState(false);
  const [isCapable, setIsCapable] = React.useState(false);
  const [salary, setSalary] = React.useState(15000);

  const handleSalaryChange = (e: React.FormEvent<HTMLSelectElement>) => {
    // @ts-ignore
    if (e.target.value) return;

    // @ts-ignore
    setSalary(e.target.value);
  };

  const CalculateCourse = () => {
    setIsCalculate(true);
    if (Number(salary) >= 40000) setIsCapable(true);

    setTimeout(() => {
        setIsCalculate(false)
    }, 6000)
  };
  return (
    <>
      <NewHeader />

      <div className="mt-10 sm:mt-0">
        <>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="px-4 py-5 bg-white sm:p-6">
              <h4 className="text-3xl">Calculate Course Price</h4>
              <div className="mt-5 grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Salary Range
                  </label>
                  <select
                    id="salary"
                    name="salary"
                    onChange={handleSalaryChange}
                    defaultValue="15000"
                    // value={salary}
                    autoComplete="salary"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="15000">£5000 - £20000</option>
                    <option value="40000">£20000 - £40000</option>
                    <option value="65000">£40000 - £65000</option>
                    <option value="95000">£65000 - £95000</option>
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="street-address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Role
                  </label>
                  <input
                    type="text"
                    name="street-address"
                    id="street-address"
                    autoComplete="street-address"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-center sm:px-6">
              <button
                onClick={() => CalculateCourse()}
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-adhdDarkPurple hover:bg-adhdDarkPurple focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Calculate
              </button>

              {isCalculate ? (
                <div className="px-4 py-4 text-2xl">
                  {!isCapable
                    ? "Course Price is £10 per session"
                    : "The Course Price is £20 per session."}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </>
      </div>
    </>
  );
}
