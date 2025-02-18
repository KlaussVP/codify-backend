/* eslint-disable linebreak-style */

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('courses', [{
      name: 'JavaScript do zero!',
      description: 'Aprenda JavaScript do zero ao avançado, com muita prática!',
      image: 'https://static.imasters.com.br/wp-content/uploads/2018/12/10164438/javascript.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Python do zero!',
      description: 'Aprenda Python do zero ao avançado, com muita prática!',
      image: 'https://sujeitoprogramador.com/wp-content/uploads/2019/11/pythondozero.png',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'Java do zero!',
      description: 'Aprenda Java do zero ao avançado, com muita prática!',
      image: 'https://miro.medium.com/max/1200/1*ADqbtRNCtoGE-1bvvoSQdg.jpeg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      name: 'C# do zero!',
      description: 'Aprenda C# do zero ao avançado, com muita prática!',
      image: 'https://addcode.io/wp-content/uploads/2020/02/csharp.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
    const courseChapters = [
      [
        {
          name: 'Apresentação',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Preparando o ambiente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Introdução à linguagem JS',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variáveis e Tipos de Dados',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Estruturas lógicas e condicionais',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      [
        {
          name: 'Apresentação',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Preparando o ambiente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Introdução à linguagem Python',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variáveis e Tipos de Dados',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Estruturas lógicas e condicionais',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      [
        {
          name: 'Apresentação',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Preparando o ambiente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Introdução à linguagem Java',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variáveis e Tipos de Dados',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Estruturas lógicas e condicionais',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      [
        {
          name: 'Apresentação',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Preparando o ambiente',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Introdução à linguagem C#',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Variáveis e Tipos de Dados',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Estruturas lógicas e condicionais',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    ];

    const coursesIds = await queryInterface.sequelize.query(
      'SELECT id from courses;',
    );

    const ids = coursesIds[0];

    await queryInterface.bulkInsert('chapters',
      [
        {
          ...courseChapters[0][0],
          courseId: ids[0].id,
        },
        {
          ...courseChapters[0][1],
          courseId: ids[0].id,
        },
        {
          ...courseChapters[0][2],
          courseId: ids[0].id,
        },
        {
          ...courseChapters[0][3],
          courseId: ids[0].id,
        },
        {
          ...courseChapters[1][0],
          courseId: ids[1].id,
        },
        {
          ...courseChapters[1][1],
          courseId: ids[1].id,
        },
        {
          ...courseChapters[1][2],
          courseId: ids[1].id,
        },
        {
          ...courseChapters[1][3],
          courseId: ids[1].id,
        },
        {
          ...courseChapters[2][0],
          courseId: ids[2].id,
        },
        {
          ...courseChapters[2][1],
          courseId: ids[2].id,
        },
        {
          ...courseChapters[2][2],
          courseId: ids[2].id,
        },
        {
          ...courseChapters[2][3],
          courseId: ids[2].id,
        },
        {
          ...courseChapters[3][0],
          courseId: ids[3].id,
        },
        {
          ...courseChapters[3][1],
          courseId: ids[3].id,
        },
        {
          ...courseChapters[3][2],
          courseId: ids[3].id,
        },
        {
          ...courseChapters[3][3],
          courseId: ids[3].id,
        },
      ], {});

    const topics = [
      {
        name: 'Como usar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Entrando na plataforma',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fazendo teorias',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fazendo exercícios',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const chaptersIds = await queryInterface.sequelize.query(
      'SELECT id from chapters;',
    );

    await queryInterface.bulkInsert('topics',
      [
        {
          ...topics[0],
          chapterId: chaptersIds[0][0].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][0].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][0].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][0].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][1].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][1].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][1].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][1].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][2].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][2].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][2].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][2].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][3].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][3].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][3].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][3].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][4].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][4].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][4].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][4].id,
        },
        {
          ...topics[0],
          chapterId: chaptersIds[0][5].id,
        },
        {
          ...topics[1],
          chapterId: chaptersIds[0][5].id,
        },
        {
          ...topics[2],
          chapterId: chaptersIds[0][5].id,
        },
        {
          ...topics[3],
          chapterId: chaptersIds[0][5].id,
        },
      ], {});

    const theory = {
      youtubeLink: 'https://www.youtube.com/embed/Ptbk2af68e8',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const topicsIds = await queryInterface.sequelize.query(
      'SELECT id from topics;',
    );

    await queryInterface.bulkInsert('theories',
      [
        {
          ...theory,
          topicId: topicsIds[0][0].id,
        },
        {
          ...theory,
          topicId: topicsIds[0][1].id,
        },
        {
          ...theory,
          topicId: topicsIds[0][2].id,
        },
        {
          ...theory,
          topicId: topicsIds[0][3].id,
        },
      ], {});

    const exercises = [
      {
        baseCode: `
        function sumArray(array) {
          //Insira seu código aqui
        }`,
        testCode: `
        describe('sumArray', () => {
          it('should return the sum of all numbers from the passed array', () => {
            const array = [2,4,6,8,10];
        
            const result = sumArray(array);
        
            expect(result).to.equal(30);
          });
        
          it('should return 0 when passed an empty array', () => {
            const array = [];
        
            const result = sumArray(array);
        
            expect(result).to.equal(0);
          });
        
          it('should return a negative number when the sum is negative', () => {
            const array = [3, -12, 5, 6, -8];
        
            const result = sumArray(array);
        
            expect(result).to.equal(-6);
          });
        })`,
        statement: `
          Dada uma array não ordenada de números inteiros,
          retorne a soma de todos os números.
          Exemplo: 
          Quando enviado [2,1,-4,6,8], retornar 13.`,
        solutionCode: `
        function sumArray(array) {
          let sum = 0;
        
          for (let i = 0; i < array.length; i++) {
            sum += array[i];
          }
        
          return sum;
        }`,
        position: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        baseCode: `
        function sumArray2(array) {
          //Insira seu código aqui
        }`,
        testCode: `
        describe('sumArray', () => {
          it('should return the sum of all numbers from the passed array', () => {
            const array = [2,4,6,8,10];
        
            const result = sumArray(array);
        
            expect(result).to.equal(30);
          });
        
          it('should return 0 when passed an empty array', () => {
            const array = [];
        
            const result = sumArray(array);
        
            expect(result).to.equal(0);
          });
        
          it('should return a negative number when the sum is negative', () => {
            const array = [3, -12, 5, 6, -8];
        
            const result = sumArray(array);
        
            expect(result).to.equal(-6);
          });
        })`,
        statement: `
          Dada uma array não ordenada de números inteiros,
          retorne a soma de todos os números.
          Exemplo: 
          Quando enviado [2,1,-4,6,8], retornar 13.`,
        solutionCode: `
        function sumArray2(array) {
          let sum = 0;
        
          for (let i = 0; i < array.length; i++) {
            sum += array[i];
          }
        
          return sum;
        }`,
        position: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        baseCode: `
        function sumArray3(array) {
          //Insira seu código aqui
        }`,
        testCode: `
        describe('sumArray', () => {
          it('should return the sum of all numbers from the passed array', () => {
            const array = [2,4,6,8,10];
        
            const result = sumArray(array);
        
            expect(result).to.equal(30);
          });
        
          it('should return 0 when passed an empty array', () => {
            const array = [];
        
            const result = sumArray(array);
        
            expect(result).to.equal(0);
          });
        
          it('should return a negative number when the sum is negative', () => {
            const array = [3, -12, 5, 6, -8];
        
            const result = sumArray(array);
        
            expect(result).to.equal(-6);
          });
        })`,
        statement: `
          Dada uma array não ordenada de números inteiros,
          retorne a soma de todos os números.
          Exemplo: 
          Quando enviado [2,1,-4,6,8], retornar 13.`,
        solutionCode: `
        function sumArray3(array) {
          let sum = 0;
        
          for (let i = 0; i < array.length; i++) {
            sum += array[i];
          }
        
          return sum;
        }`,
        position: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('exercises',
      [
        {
          ...exercises[0],
          topicId: topicsIds[0][0].id,
        },
        {
          ...exercises[1],
          topicId: topicsIds[0][0].id,
        },
        {
          ...exercises[2],
          topicId: topicsIds[0][0].id,
        },
        {
          ...exercises[0],
          topicId: topicsIds[0][1].id,
        },
        {
          ...exercises[1],
          topicId: topicsIds[0][1].id,
        },
        {
          ...exercises[2],
          topicId: topicsIds[0][1].id,
        },
        {
          ...exercises[0],
          topicId: topicsIds[0][2].id,
        },
        {
          ...exercises[1],
          topicId: topicsIds[0][2].id,
        },
        {
          ...exercises[2],
          topicId: topicsIds[0][2].id,
        },
        {
          ...exercises[0],
          topicId: topicsIds[0][3].id,
        },
        {
          ...exercises[1],
          topicId: topicsIds[0][3].id,
        },
        {
          ...exercises[2],
          topicId: topicsIds[0][3].id,
        },
      ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('exercises', null, {});
    await queryInterface.bulkDelete('theories', null, {});
    await queryInterface.bulkDelete('topics', null, {});
    await queryInterface.bulkDelete('chapters', null, {});
    await queryInterface.bulkDelete('courses', null, {});
  },
};
