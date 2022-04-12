import Reel from "./Reel.js";
import Symbol from "./Symbol.js";
import axios from "axios";

export default class Slot {
  constructor(domElement, config = {}) {
    Symbol.preload();

    this.currentSymbols = [
      ["grapes", "grapes", "grapes"],
      ["grapes", "grapes", "grapes"],
      ["grapes", "grapes", "grapes"],
      ["grapes", "grapes", "grapes"],
      ["grapes", "grapes", "grapes"],
    ];

    this.nextSymbols = [
      ["grapes", "grapes", "grapes"],
      ["grapes", "grapes", "grapes"],
      ["grapes", "grapes", "grapes"],
      ["grapes", "grapes", "grapes"],
      ["grapes", "grapes", "grapes"],
    ];

    this.container = domElement;

    this.reels = Array.from(this.container.getElementsByClassName("reel")).map(
      (reelContainer, idx) =>
        new Reel(reelContainer, idx, this.currentSymbols[idx])
    );

    this.spinButton = document.getElementById("spin");
    this.spinButton.addEventListener("click", () => this.spin());

    this.autoPlayCheckbox = document.getElementById("autoplay");

    if (config.inverted) {
      this.container.classList.add("inverted");
    }

    this.config = config;
  }

  async spin() {
    this.currentSymbols = this.nextSymbols;

    const response = await axios.get("http://localhost:3000/api/v1/spin");
    this.nextSymbols = response.data;

    this.onSpinStart(this.nextSymbols);

    return Promise.all(
      this.reels.map((reel) => {
        reel.renderSymbols(this.nextSymbols[reel.idx]);
        return reel.spin();
      })
    ).then(() => this.onSpinEnd(this.nextSymbols));
  }

  onSpinStart(symbols) {
    this.spinButton.disabled = true;

    this.config.onSpinStart?.(symbols);
  }

  onSpinEnd(symbols) {
    this.spinButton.disabled = false;

    this.config.onSpinEnd?.(symbols);

    if (this.autoPlayCheckbox.checked) {
      return window.setTimeout(() => this.spin(), 200);
    }
  }
}
