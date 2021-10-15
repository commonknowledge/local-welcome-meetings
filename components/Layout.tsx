import { Logo } from "./Branding";
import { useUser } from "../data/auth";
import { useRoom } from "../data/room";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";

export function Header() {
  const { room } = useRoom();
  const { isLoggedIn, signOut } = useUser();
  const router = useRouter();

  return (
    <header className="bg-adhdPurple p-3 sm:p-4 text-adhdBlue">
      <div
        className={`flex flex-row justify-between items-center max-w-md mx-auto`}
      >
        <Link href="/" passHref>
          <span className="inline-block cursor-pointer">
            <Logo />
          </span>
        </Link>
        <div className="space-x-4 text-right">
          {room && <span className="font-semibold text-lg">{room.name}</span>}
          {isLoggedIn && (
            <span
              className="cursor-pointer opacity-80 bg-adhdDarkPurple rounded-lg p-2"
              onClick={signOut}
            >
              Sign out
            </span>
          )}
          {!isLoggedIn && (
            <span
              className="cursor-pointer opacity-80 bg-adhdDarkPurple rounded-lg p-2"
              onClick={() => router.push("/user")}
            >
              Sign in
            </span>
          )}
        </div>
      </div>
    </header>
  );
}

export function Loading() {
  return (
    <div className="flex flex-col justify-content items-center align-middle content-center text-center w-full absolute top-0 left-0 h-full">
      <div className="text-lg font-semibold">Loading...</div>
    </div>
  );
}

export default function NewHeader() {
  return (
    <div className=" bg-white">
      <div className="max-w-7xl mx-5 sm:px-6">
        <div className="flex justify-between items-center py-3 md:justify-start md:space-x-10">
          <div className="flex justify-start items-center lg:w-0 lg:flex-1">
            <a href="#">
              <Logo />
            </a>
            <div className="whitespace-nowrap ml-8 text-base font-medium text-gray-500 hover:text-gray-900">
              <Link href="/courses">Our Courses</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <div

              className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-adhdDarkPurple hover:bg-adhdDarkPurple"
            >
              <Link href="/user">

              Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
