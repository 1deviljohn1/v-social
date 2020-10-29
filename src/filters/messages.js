const authCodes = {
  'auth/empty-data': 'Заполните все поля',
  'auth/invalid-email': 'Некорректный адрес эл. почты',
  'auth/wrong-password': 'Неверный пароль',
  'auth/user-not-found': 'Такого пользователя нет',
  'auth/too-many-requests': 'Превышено число неудачных попыток входа',
  'auth/weak-password': 'Пароль должен быть не менее 6 символов',
  'auth/email-already-in-use': 'Такой адрес эл. почты уже используется',
  'auth/alias-already-in-use': 'Такой псевдоним уже используется',
  'auth/invalid-alias': 'Некорректный псевдоним',
  'auth/alias-format': 'Разрешено использовать только латинские буквы и цифры',
  'auth/user-disabled': 'Пользователь заблокирован'
}

export default function convertAuthCode(code) {
  return authCodes[code] || code
}
