import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Logo = () => {
    return (
        <Link href="/">
            <Image
                src="/images/logo_taskivio.png"
                alt="Taskivio"
                width={100000000}
                height={100000000}
                className="w-[170px]"
                priority
            />
        </Link>
    );
};

export default Logo;
