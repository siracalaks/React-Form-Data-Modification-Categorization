import { toast } from 'react-toastify';

class ReminderService {
  constructor() {
    this.checkPermission();
    this.reminders = JSON.parse(localStorage.getItem('reminders')) || [];
    this.initializeReminders();
  }

  async checkPermission() {
    if (!('Notification' in window)) {
      console.log('Bu tarayıcı bildirim desteği sunmuyor');
      return;
    }

    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  }

  initializeReminders() {
    this.reminders.forEach(reminder => {
      if (new Date(reminder.date) > new Date()) {
        this.scheduleReminder(reminder);
      }
    });
  }

  addReminder(reminder) {
    const newReminder = {
      ...reminder,
      id: Math.random().toString(),
      created: new Date().toISOString(),
    };

    this.reminders.push(newReminder);
    localStorage.setItem('reminders', JSON.stringify(this.reminders));
    this.scheduleReminder(newReminder);

    toast.success('Hatırlatıcı eklendi!');
    return newReminder;
  }

  removeReminder(id) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    localStorage.setItem('reminders', JSON.stringify(this.reminders));
    toast.info('Hatırlatıcı silindi');
  }

  scheduleReminder(reminder) {
    const now = new Date().getTime();
    const reminderTime = new Date(reminder.date).getTime();
    const timeUntilReminder = reminderTime - now;

    if (timeUntilReminder > 0) {
      setTimeout(() => {
        this.showNotification(reminder);
      }, timeUntilReminder);
    }
  }

  showNotification(reminder) {
    // Tarayıcı bildirimi
    if (Notification.permission === 'granted') {
      new Notification(reminder.title, {
        body: reminder.description,
        icon: '/logo192.png',
      });
    }

    // Toast bildirimi
    toast.info(`🔔 ${reminder.title}: ${reminder.description}`, {
      autoClose: false,
    });
  }

  getUpcomingReminders() {
    const now = new Date();
    return this.reminders
      .filter(r => new Date(r.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getPastReminders() {
    const now = new Date();
    return this.reminders
      .filter(r => new Date(r.date) <= now)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
}

export const reminderService = new ReminderService(); 