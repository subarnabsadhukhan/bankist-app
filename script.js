"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2023-10-23T17:01:17.194Z",
    "2023-10-26T23:36:17.929Z",
    "2023-10-28T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2023-10-28T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    "2020-01-25T14:18:46.235Z",
    "2020-01-28T09:15:04.904Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-01T10:17:24.185Z",
    "2020-04-10T14:43:26.374Z",
    "2020-05-08T14:11:59.604Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "INR",
  locale: "hi-IN",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
    "2021-04-10T14:43:26.374Z",
    "2021-06-25T18:49:59.371Z",
    "2021-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "de-DE",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const currentDate = function (date = Date.now(), locale = "en-US") {
  const now = new Date(date);
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Intl.DateTimeFormat(locale, options).format(now);
};
const formatCurrency = (value, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);

const calcDaysPassed = function (actualDate, acc) {
  const time = new Date();
  const displayDate = new Date(actualDate).getTime();
  const elapsedTimeToday =
    (time.getTime() -
      new Date(
        time.getFullYear(),
        time.getMonth(),
        time.getDate(),
        0,
        0
      ).getTime()) /
    (1000 * 60 * 60 * 24);
  const daysPassed =
    (new Date().getTime() - displayDate) / (1000 * 60 * 60 * 24);

  if (daysPassed <= elapsedTimeToday)
    return "Today," + currentDate(actualDate, acc.locale).slice(11);
  else if (daysPassed <= elapsedTimeToday + 1)
    return "Yesterday," + currentDate(actualDate, acc.locale).slice(11);
  else if (daysPassed <= elapsedTimeToday + 7)
    return (
      `${Math.ceil(daysPassed)} days ago,` +
      currentDate(actualDate, acc.locale).slice(11)
    );
  else return currentDate(actualDate, acc.locale);
};
// #E-2 (creating displayMovements function)
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const sortedMovements = sort
    ? acc.movements
        .map((el, i) => [el, i])
        .slice()
        .sort((a, b) => a[0] - b[0])
    : acc.movements.map((el, i) => [el, i]);

  sortedMovements.forEach(function ([mov, i]) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${calcDaysPassed(
      acc.movementsDates[i],
      acc
    )}</div>
      <div class="movements__value">${formatCurrency(
        mov.toFixed(2),
        acc.locale,
        acc.currency
      )}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// #E-3
const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");

    account.username;
  });
};
createUsernames(accounts);

// #E-4
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCurrency(
    balance.toFixed(2),
    acc.locale,
    acc.currency
  )}`;
  return balance;
};
// #E-8
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

// #E-5
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const out = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((deposit, i, arr) => deposit >= 1)
    .reduce((acc, deposit) => acc + deposit, 0);

  labelSumIn.textContent = `${formatCurrency(
    incomes.toFixed(2),
    account.locale,
    account.currency
  )}`;
  labelSumOut.textContent = `${formatCurrency(
    out.toFixed(2),
    account.locale,
    account.currency
  )}`;
  labelSumInterest.textContent = `${formatCurrency(
    interest.toFixed(2),
    account.locale,
    account.currency
  )}`;
};

// #E-6
let currentAccount;
//// Event Handler
btnLogin.addEventListener("click", function (e) {
  // Prevent form from Submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (el) => el.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    // Display UI and message
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    labelDate.textContent = currentDate(undefined, currentAccount.locale);
    // Clear input fields
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginUsername.blur();
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});
// #E-7
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const receiverAccount = accounts.find(
    (el) => el.username === inputTransferTo.value
  );
  const sendingAmount = Number(inputTransferAmount.value);

  if (
    receiverAccount &&
    receiverAccount.username !== currentAccount.username &&
    calcDisplayBalance(currentAccount) >= sendingAmount &&
    sendingAmount > 0
  ) {
    receiverAccount.movements.push(sendingAmount);
    currentAccount.movements.push(-sendingAmount);

    const date = new Date();
    receiverAccount.movementsDates.push(date.toISOString());
    currentAccount.movementsDates.push(date.toISOString());
    updateUI(currentAccount);
  }
  // Clear input fields
  inputTransferAmount.value = inputTransferTo.value = "";
  inputTransferAmount.blur();
  inputTransferTo.blur();
});
// #E-9
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    // Delete Account
    accounts.splice(index, 1);
    // Hide UI
    containerApp.style.opacity = 0;
    // Change Welcome Message
    labelWelcome.textContent = `Log in to get started`;
  }
  inputClosePin.value = inputCloseUsername.value = "";
  inputClosePin.blur();
  inputCloseUsername.blur();
});

// #E-10
// Loan Rule: if there is atleast one deposit with atleast 10% of the requested loan amount.

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((mov) => mov >= loanAmount * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      const date = new Date();
      currentAccount.movementsDates.push(date.toISOString());
      updateUI(currentAccount);
    }, 5000);
  }
  inputLoanAmount.value = "";
  inputLoanAmount.blur();
});

// #E-11
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
