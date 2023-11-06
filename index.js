// Import the Json File Data
import data from "./currencies.json" assert { type: "json" };

const currencies = data;

// console.log(currencies);

let selectors_ = document.querySelectorAll(".currency-selector");
let rate_element = document.querySelector(".value");
let from_selector = document.querySelector("#from");
let to_selector = document.querySelector("#to");
let amount = document.querySelector("#amount");
let symbol_element = document.querySelector(".symbol");
let button = document.querySelector("button");
let eq_element = document.querySelector("#equ");

// Populating the selectors with the currencies

const populate_currencies = (parent) => {
  let build_string = "";

  for (const format in currencies) {
    let single = currencies[format];
    let temp = `<option value="${single["code"]}">${single["code"]} | ${single["name"]}</option>`;

    build_string += temp;
  }

  parent.innerHTML += build_string;
  build_string = "";
};

selectors_.forEach((element) => {
  populate_currencies(element);
});

const get_rate = async () => {
  let api_key = "c1a465086e3690fef600717cb8ba5060";
  let url = `http://data.fixer.io/api/latest?access_key=${api_key}`;

  if (from_selector.value == 0 || to_selector.value == 0 || !amount.value) {
    console.log("Not Feching");
    return;
  }

  await fetch(url)
    .then((res) => res.json())
    .then((result) => {
      console.log(result);
      if (!("rates" in result)) {
        eq_element.value = "Error fetching Data!!!";
        return;
      }

      let rate_value =
        result["rates"][to_selector.value] /
        result["rates"][from_selector.value];

      if (!rate_value) {
        eq_element.value = "Error getting Rate!!!";
      }

      //   console.log(rate_value);

      // Output

      if (rate_value > 1000) {
        rate_element.innerText = rate_value.toFixed(1);
      } else if (rate_value > 100) {
        rate_element.innerText = rate_value.toFixed(2);
      } else if (rate_value > 10) {
        rate_element.innerText = rate_value.toFixed(3);
      } else {
        rate_element.innerText = rate_value.toFixed(4);
      }

      //   if (rate_value < 10) {
      //     rate_element.innerText = rate_value.toFixed(4);
      //   } else if (rate_value > 10) {
      //     rate_element.innerText = rate_value.toFixed(3);
      //   } else if (rate_value > 100) {
      //     rate_element.innerText = rate_value.toFixed(2);
      //   } else if (rate_value > 1000) {

      //   }

      let temp = amount.value * rate_value;
      eq_element.value = temp.toFixed(2);
    });
};

const change_currency_icon = (e) => {
  let format = to_selector.value;
  if (format == "0") {
    return;
  }
  symbol_element.innerText = currencies[format]["symbol_native"];

  get_rate();
};

to_selector.addEventListener("change", change_currency_icon);

from_selector.addEventListener("change", get_rate);

const isNan = (number) => {
  return /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.test(number);
};

amount.addEventListener("input", () => {
  if (!isNan(amount.value)) {
    amount.value = amount.value.slice(0, -1);
    return;
  }

  get_rate();
});

button.addEventListener("click", () => {
  [from_selector.value, to_selector.value] = [
    to_selector.value,
    from_selector.value,
  ];

  change_currency_icon();
});
