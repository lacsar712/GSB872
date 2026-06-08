import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown, ChevronUp, BookOpen, Send } from 'lucide-react';
import clsx from 'clsx';

const CheckInPage = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    // selections: { [bookId]: [chapter1, chapter2, ...] }
    const [selections, setSelections] = useState({});
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/bible/books').then(res => setBooks(res.data));
    }, []);

    const handleBookSelect = (book) => {
        setSelectedBook(book);
    };

    const toggleChapter = (num) => {
        const bookId = selectedBook.id;
        const currentChapters = selections[bookId] || [];
        let newChapters;
        
        if (currentChapters.includes(num)) {
            newChapters = currentChapters.filter(c => c !== num);
        } else {
            newChapters = [...currentChapters, num].sort((a,b) => a - b);
        }

        setSelections(prev => ({
            ...prev,
            [bookId]: newChapters
        }));
    };

    const handleSubmit = async () => {
        const bookIdsToSubmit = Object.keys(selections).filter(id => selections[id] && selections[id].length > 0);
        if (bookIdsToSubmit.length === 0) return;
        
        setLoading(true);
        try {
            const promises = bookIdsToSubmit.map(bookId => {
                const book = books.find(b => b.id == bookId);
                return api.post('/checkins', {
                    book_name: book.name,
                    chapters: selections[bookId],
                    comment
                });
            });

            await Promise.all(promises);
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Check-in failed. Please try again.'); 
        } finally {
            setLoading(false);
        }
    };

    // Derived state for current view
    const currentSelectedChapters = selectedBook && selectedBook.id ? (selections[selectedBook.id] || []) : [];
    
    // Calculate total chapters selected across all books
    const totalSelectedCount = Object.values(selections).reduce((acc, curr) => acc + curr.length, 0);

    return (
        <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpen className="mr-3 text-blue-600" />
                今日打卡
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700">1. 选择经卷</h2>
                    {totalSelectedCount > 0 && (
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            已选 {totalSelectedCount} 章
                        </span>
                    )}
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                    {books.length > 0 ? books.map(book => (
                        <div 
                            key={book.id} 
                            onClick={() => handleBookSelect(book)}
                            className={clsx(
                                "flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                                selectedBook?.id === book.id && "bg-blue-50 text-blue-700"
                            )}
                        >
                            <span className="font-medium">
                                {book.name}
                            </span>
                            <div className="flex items-center">
                                {selections[book.id] && selections[book.id].length > 0 && (
                                     <span className="mr-2 text-xs text-white bg-blue-500 rounded-full h-5 w-5 flex items-center justify-center">
                                        {selections[book.id].length}
                                     </span>
                                )}
                                {selectedBook?.id === book.id && <ChevronDown size={16} />}
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            正在加载经卷...
                        </div>
                    )}
                </div>
            </div>

            {selectedBook && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 animate-fade-in">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-700">2. 选择章节 ({selectedBook.name})</h2>
                        <span className="text-xs text-gray-400">已选 {currentSelectedChapters.length} 章</span>
                    </div>
                    <div className="p-4 grid grid-cols-5 gap-3">
                        {Array.from({ length: selectedBook.chapter_count || 0 }, (_, i) => i + 1).map(chapter => (
                            <button
                                key={chapter}
                                onClick={() => toggleChapter(chapter)}
                                className={clsx(
                                    "h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                                    currentSelectedChapters.includes(chapter)
                                        ? "bg-blue-600 text-white shadow-md transform scale-105"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                )}
                            >
                                {chapter}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-4 bg-gray-50 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-700">3. 心得体会 (可选)</h2>
                </div>
                <textarea
                    className="w-full p-4 h-32 outline-none resize-none text-gray-700 placeholder-gray-400"
                    placeholder="分享今天的读经感悟..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={totalSelectedCount === 0 || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                {loading ? '提交中...' : '提交打卡'}
                {!loading && <Send className="ml-2 w-5 h-5" />}
            </button>
        </div>
    );
};

export default CheckInPage;
