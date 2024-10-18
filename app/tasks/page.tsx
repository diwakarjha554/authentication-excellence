import TodoList from '@/components/tasks';
import NavbarMarginLayout from '@/components/ui/navbar-margin-layout';
import React from 'react';

const page = () => {
    return (
        <main className="flex min-h-screen flex-col items-center justify-start min-w-screen overflow-x-hidden relative">
            <NavbarMarginLayout>
                <div className='flex flex-col gap-2'>
                    <span className='text-3xl font-semibold'>Welcome back!</span>
                    <span className='text-neutral-800'>Here's a list of your tasks for this month!</span>
                </div>
                <TodoList />
            </NavbarMarginLayout>
        </main>
    );
};

export default page;
