import { Space_Mono } from 'next/font/google';
import { create } from 'zustand';

const useStore = create((set) => ({
  bill: 0,
  tip: 0,
  totalPerPerson: 0,
  tipCalculated: false,
  tipPerPerson: 0,
  numberOfPersons: 0,
  errorText: "",

  // Update functions
  setBill: (bill) => set({ bill }),
  setTip: (tip) => set({ tip }),
  setNumberOfPersons: (numberOfPersons) => set({ numberOfPersons }),

  // Calculate tip logic
  calculateTip: () => set((state) => {
    const bill = parseFloat(state.bill);
    const tip = parseFloat(state.tip);
    const tipPercent = parseFloat(state.tip);
    const persons = parseInt(state.numberOfPersons);

    if (isNaN(bill) || isNaN(persons) || isNaN(tip) || persons === 0) return {
      tipPerPerson: 0,
      totalPerPerson: 0,
      errorText: "Can't be zero"
    };

    const totalTip = (tipPercent / 100) * bill;
    return {
      tipPerPerson: (totalTip / persons).toFixed(2),
      totalPerPerson: ((bill + totalTip) / persons).toFixed(2),
      tipCalculated: true,
      errorText: ""
    }
  }),

  reset: () => set({
    bill: 0,
    tip: 0,
    isCustom: false,
    totalPerPerson: 0,
    tipPerPerson: 0,
    numberOfPersons: 1,
    tipCalculated: false
  }),
}));

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'], //
});

const tipPercentages = [5, 10, 15, 25, 50]

export default function Home() {
  const {
    bill,
    tipCalculated,
    numberOfPersons,
    setBill,
    setTip,
    setNumberOfPersons,
    tipPerPerson,
    totalPerPerson,
    calculateTip,
    reset,
    errorText
  } = useStore();

  console.log(errorText);


  return (
    <main className={`${spaceMono.className} w-full lg:h-screen bg-cyan-100 flex flex-col items-center justify-center text-cyan-800 text-base font-bold`} >
      <div className='text-center mb-20 mt-16 lg:mt-0'>
        <img alt='logo' src='/images/logo.svg' />
      </div>
      <section className='w-full lg:w-3/5 bg-white h-min p-8 rounded-2xl gap-4 block lg:flex shadow-xl'>
        <form className='w-full lg:w-1/2'>
          <div className='mb-4'>
            <label>Bill</label>
            <div className='flex items-center justify-between relative bg-gray-100 rounded-md'>
              <img alt='dollar-sign' className='w-min absolute left-4' src='/images/icon-dollar.svg' />
              <input
                type='text'
                placeholder='0'
                className='input focus:border-2 focus:border-cyan-600 outline-none py-2 px-3 w-full rounded-md h-full text-right'
                value={bill}
                onChange={(e) => {
                  setBill(e.target.value);
                  calculateTip();
                }}
              />
            </div>
          </div>
          <div className='mb-4'>
            <label className=''>Select amount %</label>
            <div className='mt-3 grid grid-cols-2 lg:grid-cols-3 grid-rows-3 lg:grid-rows-2 gap-4'>
              <>{
                tipPercentages.map((perc, indx) => {
                  return <button
                    key={indx}
                    type='button'
                    className='cursor-pointer text-white rounded-sm shadow-sm bg-cyan-900 px-3 py-2 hover:bg-cyan-200 hover:text-cyan-900'
                    onClick={() => {
                      setTip(perc);
                      calculateTip();
                    }}
                  >
                    {perc}%
                  </button>
                })
              }</>
              <input
                type='text'
                placeholder='Custom'
                className='p-2 bg-cyan-50 rounded-md text-cyan-800 outline-none focus:border-2 focus:border-cyan-600'
                onChange={(e) => {
                  setTip(e.target.value);
                  calculateTip();
                }}
              />
            </div>
          </div>
          <div className='mb-4'>
            <div className='flex items-center justify-between'>
              <label>Number of people</label>
              <p className='text-red-500'>{errorText}</p>
            </div>
            <div className='flex items-center justify-between relative bg-gray-100 rounded-md'>
              <img alt='avatar' className='w-min absolute left-4' src='/images/icon-person.svg' />
              <input
                type='text'
                placeholder='0'
                className='input focus:border-2 focus:border-cyan-600 py-2 px-3 w-full outline-none rounded-md h-full text-right'
                value={numberOfPersons}
                onChange={(e) => {
                  setNumberOfPersons(e.target.value);
                  calculateTip();
                }}
              />
            </div>
          </div>
        </form>
        <div className='bg-cyan-900 lg:w-1/2 rounded-xl p-4'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <p className='text-white text-base'>Tip</p>
              <p className='text-gray-200 text-xs'>/ person</p>
            </div>
            <h2 className='text-4xl text-cyan-200'>${tipPerPerson}</h2>
          </div>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-white text-base'>Total</p>
              <p className='text-gray-200 text-xs'>/ person</p>
            </div>
            <h2 className='text-4xl text-cyan-200'>${totalPerPerson}</h2>
          </div>
          <button
            onClick={reset}
            className={`uppercase w-full p-2 rounded-md mt-36 cursor-pointer ${tipCalculated ? 'text-cyan-900 bg-cyan-300' : 'bg-cyan-300 opacity-10 text-cyan-900 shadow-md'}`}
          >
            reset
          </button>
        </div>
      </section>
    </main>
  );
}