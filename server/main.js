import { Meteor } from 'meteor/meteor';
import { MenuCollection, OfficeCartCollection } from '/imports/api/collections';
import { INITIAL_MENU_ITEMS } from '/imports/api/fixtures/menuData';

Meteor.startup(async () => {
  await MenuCollection.removeAsync({});

  for (const item of INITIAL_MENU_ITEMS) {
    await MenuCollection.insertAsync(item);
  }

  console.log('Меню успешно обновлено из menuData.js!');
});

Meteor.publish('officeFoodData', function () {
  return [
    MenuCollection.find(),
    OfficeCartCollection.find()
  ];
});

Meteor.methods({
  'cart.addItem': async function ({ menuItemId, userName }) {
    const user = String(userName || '').trim();

    if (!user) {
      throw new Meteor.Error('invalid-user', 'Укажите ваше имя перед выбором блюда!');
    }

    const menuItem = await MenuCollection.findOneAsync(menuItemId);

    if (!menuItem) {
      throw new Meteor.Error('not-found', 'Блюдо не найдено');
    }

    await OfficeCartCollection.insertAsync({
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      userName: user,
      isPaid: false,
      createdAt: new Date()
    });
  },

  'cart.markPaid': async function (itemId) {
    const item = await OfficeCartCollection.findOneAsync(itemId);

    if (!item) {
      throw new Meteor.Error('not-found', 'Элемент корзины не найден');
    }

    await OfficeCartCollection.updateAsync(itemId, {
      $set: { isPaid: true }
    });
  },

  'cart.removeItem': async function (itemId) {
    await OfficeCartCollection.removeAsync(itemId);
  },

  'cart.clear': async function () {
    await OfficeCartCollection.removeAsync({});
  }
});
