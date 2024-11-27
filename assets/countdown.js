var CountdownTimer = class extends HTMLElement {
  constructor() {
    super();

    this.settings = JSON.parse(this.querySelector('[data-settings]').innerHTML);

    this.daysEl = this.querySelector('[data-days]');
    this.hoursEl = this.querySelector('[data-hours]');
    this.minutesEl = this.querySelector('[data-minutes]');
    this.secondsEl = this.querySelector('[data-seconds]');

    this.timezoneString = " GMT".concat(this.settings.shopTimezone);
    this.countDownDate = new Date(Date.parse("".concat(this.settings.month, " ").concat(this.settings.day, ", ").concat(this.settings.year, " ").concat(this.settings.hour, ":").concat(this.settings.minute).concat(this.timezoneString)));
    this.countDownTime = this.countDownDate.getTime();
    this.timerInterval = setInterval(this.timerLoop.bind(this), 1000);
    this.timerLoop();
  }

  timerLoop() {
    window.requestAnimationFrame(() => {
      const now = new Date().getTime();
      const distance = this.countDownTime - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60));
      let minutes = Math.floor(distance % (1000 * 60 * 60) / (1000 * 60));
      let seconds = Math.floor(distance % (1000 * 60) / 1000);

      days.length == 1 ? day

      if (distance < 0) {
        this.timerInterval && clearInterval(this.timerInterval);
        this.daysEl.innerHTML = 0;
        this.hoursEl.innerHTML = 0;
        this.minutesEl.innerHTML = 0;
        this.secondsEl.innerHTML = 0;
        if (this.hideWhenComplete) {
          this.remove();
        }
      } else {
        this.daysEl.innerHTML = days;
        this.hoursEl.innerHTML = hours;
        this.minutesEl.innerHTML = minutes;
        this.secondsEl.innerHTML = seconds;
      }
    });
  }

  handleNumber(number) {
    return number < 10 ? `0${number}` : number;
  }
}

customElements.define('countdown-timer', CountdownTimer);