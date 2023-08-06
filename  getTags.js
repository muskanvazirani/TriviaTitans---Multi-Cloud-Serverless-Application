const language = require('@google-cloud/language');
const cors = require('cors')({origin: true});

exports.getTags = async (req, res) => {
  cors(req, res, async () => {
    try {
      const client = new language.LanguageServiceClient();
  
      let content = req.body.text;
      while(content.split(' ').length < 20){
        content += ` ${req.body.text}`;
      }
  
      const document = {
        content,
        type: 'PLAIN_TEXT',
      };
  
      let [result] = await client.classifyText({document});
      let categories = result.categories;
  
      if (categories.length === 0) { 
        [result] = await client.analyzeEntities({document});
        categories = result.entities.map(entity => ({name: "/Text/Entities/" + entity.name, confidence: entity.salience}));
      }
  
      categories = categories.map(category => category.name.split('/').pop());
  
      res.status(200).send(categories);
    } catch (error) {
      res.status(500).send(error);
    }
  });
};
