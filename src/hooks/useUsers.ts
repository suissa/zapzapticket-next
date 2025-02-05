import { useState, MutableRefObject, useRef, useEffect } from "react"
import User from "../core/User"
import UserRepository from "../core/UserRepository"
import useLayout from "./useLayout"
import { API_URL } from "../config"
import useAuth from "./useAuth"

export default function useUsers() {
  const [user, setUser] = useState<User>(User.empty())
  const [users, setUsers] = useState<User[]>([])
  const { showForm, showTable, tableVisible } = useLayout()
  const { getAuthHeader } = useAuth()

  useEffect(listAllUsers, [])

  function createUser() {
    setUser(User.empty())
    showForm()
  }

  function listUsers() {
    fetch(`${API_URL}/users`, {
      headers: getAuthHeader(), // Adicione o cabeçalho de autenticação aqui
    })
      .then(response => response.json())
      .then(data => {
        // console.log("listUsers then", data)
        return setUsers(data)
      })
  }

  function listAllUsers() {
    fetch(`${API_URL}/users/all`, {
      headers: getAuthHeader(), // Adicione o cabeçalho de autenticação aqui
    })
      .then(response => response.json())
      .then(data => {
        // // console.log("listUsers then", data)
        return setUsers(data)
      })
  }

  function getUser(user: User) {
    setUser(user)
    showForm()
  }

  async function deleteUser(user: User) {
    fetch(`${API_URL}/users/${user._id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    })
      .then(response => response.json())
      .then(data => {
        // console.log("DELETE then", data)
        return listUsers()
      })
  }

  async function saveUser(user: User) {
    console.log("saveUser user", user)
    if (user.password === "") {
      console.log("saveUser user.password === ''")
      return false;
    }
    const userStr = user?._id
      ? JSON.stringify({
        _id: user._id,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        city: user.city,
        state: user.state,
        country: user.country,
        level: user.level,
        isActive: user.isActive
      })
      : JSON.stringify({
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        city: user.city,
        state: user.state,
        country: user.country,
        level: user.level,
        isActive: true
      })
    console.log("saveUser userStr", userStr)
    const response = user?._id
      ? await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PATCH',
        headers: getAuthHeader(),
        body: userStr
      })
      : await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: userStr
      });

    fetch(`${API_URL}/users/all`)
      .then(response => response.json())
      .then(data => {
        // // console.log("listUsers then", data)
        setUsers(data)
        // showTable()
      })
    // const data = await response.json();
  }

  return {
    user,
    users,
    createUser,
    saveUser,
    deleteUser,
    getUser,
    listUsers,
    listAllUsers,
    showTable,
    tableVisible,
  }
}