import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  level: number;
  image?: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'На какой свет светофора можно переходить дорогу?',
    options: ['Красный', 'Жёлтый', 'Зелёный', 'Любой'],
    correctAnswer: 2,
    level: 1,
    image: 'https://cdn.poehali.dev/projects/0d8bf414-dd80-4006-bb9d-856aa758abf1/files/eb2eb12a-d461-42be-905d-13937dbcfcf6.jpg'
  },
  {
    id: 2,
    question: 'Где безопасно переходить дорогу?',
    options: ['Где угодно', 'По зебре', 'Между машинами', 'На повороте'],
    correctAnswer: 1,
    level: 1
  },
  {
    id: 3,
    question: 'Что означает красный свет светофора?',
    options: ['Приготовься', 'Стой', 'Иди', 'Беги'],
    correctAnswer: 1,
    level: 1
  },
  {
    id: 4,
    question: 'С какой стороны нужно обходить автобус?',
    options: ['Спереди', 'Сзади', 'Лучше подождать, пока уедет', 'Пролезть под ним'],
    correctAnswer: 2,
    level: 2
  },
  {
    id: 5,
    question: 'Можно ли играть возле дороги?',
    options: ['Да, если аккуратно', 'Нет, это опасно', 'Да, на тротуаре', 'Только в мяч'],
    correctAnswer: 1,
    level: 2,
    image: 'https://cdn.poehali.dev/projects/0d8bf414-dd80-4006-bb9d-856aa758abf1/files/ee014736-ba7e-4945-90ef-9b625a77cba4.jpg'
  }
];

const Index = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, title: 'Первый шаг', description: 'Ответил на первый вопрос', icon: 'Star', unlocked: false },
    { id: 2, title: 'Знаток светофора', description: 'Правильно ответил про светофор', icon: 'Award', unlocked: false },
    { id: 3, title: 'Отличник', description: 'Набрал 5 баллов', icon: 'Trophy', unlocked: false },
    { id: 4, title: 'Мастер ПДД', description: 'Ответил правильно на все вопросы', icon: 'Medal', unlocked: false }
  ]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (answeredQuestions.length / questions.length) * 100;
  const currentLevel = Math.max(...answeredQuestions.map(id => questions.find(q => q.id === id)?.level || 1));

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore(score + 1);
      
      const newAchievements = [...achievements];
      if (answeredQuestions.length === 0) {
        newAchievements[0].unlocked = true;
      }
      if (currentQuestion.id === 1 && answerIndex === currentQuestion.correctAnswer) {
        newAchievements[1].unlocked = true;
      }
      if (score + 1 >= 5) {
        newAchievements[2].unlocked = true;
      }
      if (answeredQuestions.length + 1 === questions.length && score + 1 === questions.length) {
        newAchievements[3].unlocked = true;
      }
      setAchievements(newAchievements);
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnsweredQuestions([]);
  };

  const isQuizComplete = answeredQuestions.length === questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-blue-50 to-purple-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
            🚦 ПДД для детей
          </h1>
          <p className="text-lg text-muted-foreground">Учись безопасности на дороге играючи!</p>
        </header>

        <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="Target" className="text-primary" size={20} />
              <span className="font-semibold">Прогресс: {answeredQuestions.length}/{questions.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Star" className="text-accent" size={20} />
              <span className="font-semibold">Баллы: {score}</span>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <Tabs defaultValue="test" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="test" className="text-base">
              <Icon name="BookOpen" size={18} className="mr-2" />
              Тесты
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-base">
              <Icon name="Award" size={18} className="mr-2" />
              Достижения
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-base">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Прогресс
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-6">
            {!isQuizComplete ? (
              <Card className="p-6 md:p-8 animate-bounce-in shadow-xl">
                <div className="mb-6">
                  <Badge variant="secondary" className="mb-4">
                    Уровень {currentQuestion.level}
                  </Badge>
                  {currentQuestion.image && (
                    <div className="mb-6 flex justify-center">
                      <img
                        src={currentQuestion.image}
                        alt="Иллюстрация"
                        className="w-48 h-48 object-contain rounded-xl"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const isSelected = selectedAnswer === index;
                    const showFeedback = showResult && isSelected;

                    return (
                      <Button
                        key={index}
                        onClick={() => !showResult && handleAnswer(index)}
                        disabled={showResult}
                        variant={showFeedback ? (isCorrect ? 'default' : 'destructive') : 'outline'}
                        className={`w-full text-left justify-start h-auto p-4 text-lg transition-all ${
                          showFeedback && isCorrect ? 'bg-green-500 hover:bg-green-600 animate-wiggle' : ''
                        }`}
                      >
                        <span className="mr-3 text-2xl">
                          {showFeedback && isCorrect ? '✅' : showFeedback ? '❌' : String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </Button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="mt-6 animate-bounce-in">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <div className="bg-green-100 border-2 border-green-500 rounded-xl p-4 flex items-center gap-3">
                        <span className="text-4xl">🎉</span>
                        <div>
                          <p className="font-bold text-green-800">Правильно!</p>
                          <p className="text-green-700">Так держать! +1 балл</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 flex items-center gap-3">
                        <span className="text-4xl">💪</span>
                        <div>
                          <p className="font-bold text-red-800">Не совсем</p>
                          <p className="text-red-700">Правильный ответ: {currentQuestion.options[currentQuestion.correctAnswer]}</p>
                        </div>
                      </div>
                    )}

                    <Button onClick={handleNext} size="lg" className="w-full mt-4">
                      {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить тест'}
                      <Icon name="ArrowRight" className="ml-2" size={20} />
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-8 text-center animate-bounce-in shadow-xl">
                <div className="mb-6">
                  <span className="text-8xl">🏆</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">Тест завершён!</h2>
                <p className="text-xl mb-2">Твой результат:</p>
                <p className="text-5xl font-bold text-primary mb-6">{score}/{questions.length}</p>
                <p className="text-lg mb-8 text-muted-foreground">
                  {score === questions.length
                    ? 'Отлично! Ты настоящий знаток ПДД! 🌟'
                    : score >= questions.length * 0.7
                    ? 'Хорошо! Ещё немного практики! 👍'
                    : 'Продолжай учиться, у тебя всё получится! 💪'}
                </p>
                <Button onClick={handleRestart} size="lg" className="w-full">
                  <Icon name="RotateCcw" className="mr-2" size={20} />
                  Пройти заново
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            {achievements.map((achievement, index) => (
              <Card
                key={achievement.id}
                className={`p-6 transition-all animate-slide-up ${
                  achievement.unlocked ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400' : 'opacity-60'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-full ${achievement.unlocked ? 'bg-yellow-400' : 'bg-gray-200'}`}>
                    <Icon name={achievement.icon as any} size={32} className={achievement.unlocked ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{achievement.title}</h3>
                    <p className="text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && <span className="text-3xl">✨</span>}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <Card className="p-6 animate-slide-up">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Icon name="BarChart" size={28} className="text-primary" />
                Статистика обучения
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Пройдено вопросов</span>
                    <span className="text-primary font-bold">{answeredQuestions.length}/{questions.length}</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Правильных ответов</span>
                    <span className="text-green-600 font-bold">{score}/{answeredQuestions.length || 1}</span>
                  </div>
                  <Progress value={(score / (answeredQuestions.length || 1)) * 100} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Текущий уровень</span>
                    <span className="text-accent font-bold">Уровень {currentLevel}</span>
                  </div>
                  <Progress value={(currentLevel / 3) * 100} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-2xl font-bold text-blue-600">{answeredQuestions.length}</div>
                    <div className="text-sm text-muted-foreground">Вопросов решено</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🎯</div>
                    <div className="text-2xl font-bold text-green-600">{score}</div>
                    <div className="text-sm text-muted-foreground">Правильных ответов</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.unlocked).length}</div>
                    <div className="text-sm text-muted-foreground">Достижений</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-2xl font-bold text-orange-600">{currentLevel}</div>
                    <div className="text-sm text-muted-foreground">Уровень</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-4">
                <div className="text-5xl">🚗</div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Продолжай учиться!</h4>
                  <p className="text-muted-foreground">Знание правил дорожного движения — залог твоей безопасности</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;