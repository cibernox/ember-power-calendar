module.exports = function(deployTarget) {  
  return {
    pagefront: {
      app: 'ember-power-calendar',
      key: process.env.PAGEFRONT_KEY
    }
  };
};
