export type TelegramUpdateMessage = {
  message: {
    from: {
      id: number;
      first_name: string;
    };
    chat: {
      id: number;
      firs_name: string;
    };
    date: number;
    text: string;
  };
};
