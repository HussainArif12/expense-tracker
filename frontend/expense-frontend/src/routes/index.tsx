import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="p-8  space-y-1 space-y-5 leading-3">
      <h1 className="text-7xl  font-bold text-center">
        Welcome to my Expense Tracker!
      </h1>
      <h2 className="text-4xl">How to use it?</h2>
      <div className="ml-2 mt-3">
        <h3 className="text-3xl"> Bank/Sparkasse files</h3>
        <p className="text-lg">
          To upload a bank file, simply go to your local Sparkasse website (for
          example,{' '}
          <a
            className="text-blue-800 bg-pink-300 rounded-md px-2"
            href="https://www.sparkasse-duisburg.de/de/home.html"
          >
            Sparkasse Duisburg
          </a>
          ) , and then get a CSV file with the instructions
          <a
            className="text-blue-800 bg-pink-300 rounded-md px-2"
            href="https://www.sparkasse-hrv.de/content/dam/myif/spk-hilden-ratingen-velbert/work/dokumente/pdf/hrv/service/Anleitung%20zum%20Export%20von%20Umsatzdaten%20im%20Online-Banking.pdf?stref=textbox"
          >
            here
          </a>{' '}
          . Make sure to export the bank file as{' '}
          <span className="font-bold bg-pink-300 rounded-md px-2">
            CSV-MT490!
          </span>
        </p>
        <p className="text-lg">
          {' '}
          To track your data for just one month, go to{' '}
          <span className="p-1 rounded-md bg-blue-300">
            <Link to="/sparkasse_one_month"> Sparkasse One Month</Link>
          </span>
        </p>
        <p className="text-lg mt-1">
          {' '}
          To track your data for multiple months, go to{' '}
          <span className="p-1 rounded-md bg-blue-300">
            <Link to="/sparkasse_multi_month"> Sparkasse Multi Month</Link>
          </span>
        </p>
      </div>
      <h2 className="text-3xl">Trading files</h2>
      <p className="text-lg">
        Simply go{' '}
        <a
          className="text-blue-800 bg-pink-300 rounded-md px-2"
          href="https://helpcentre.trading212.com/hc/en-us/articles/360016898917-Can-I-export-the-trading-data-from-my-account"
        >
          here
        </a>
        and change your time range accordingly. The same rules as above apply
        here too.
        <span className="font-bold bg-pink-300 rounded-md px-2 ">
          Make sure you have exported everything!{' '}
        </span>
      </p>
    </div>
  )
}
