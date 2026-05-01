"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";

import ListOfUsers from "@/shared/components/ListOfUsers/ListOfUsers";
import { ListOfUsersStore } from "@/shared/components/ListOfUsers/ListOfUsers.store";
import type { User } from "@/shared/components/ListOfUsers/types";
import PopupCard from "@/shared/components/PopupCards/PopupCard";
import { PopupCardStore } from "@/shared/components/PopupCards/PopupCard.store";
import overlayStyles from "@/shared/components/PopupCards/PopupOverlay.module.scss";
import TitleBar from "@/shared/components/TitleBar/TitleBar";
import { getAppRoleFromSessionUser } from "@/shared/config/roles.config";
import { useStores } from "@/shared/store";
import { Pagination } from "@/widgets/Pagination/Pagination";

const USERS_PER_PAGE = 8;

const UsersPage = observer(() => {
  const { auth, companyStore } = useStores();
  const [popupStore] = useState(() => new PopupCardStore());
  const [usersStore] = useState(() => new ListOfUsersStore());
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const role = getAppRoleFromSessionUser(auth.currentUser);
  const canCreateUsers = role === "admin" || role === "superadmin";
  const canDeleteUsers = role === "admin" || role === "superadmin";
  const canEditAnyUser = role === "admin" || role === "superadmin";

  const getRoleLabel = (nextRole: string) =>
    nextRole === "admin" ? "Администратор" : "Пользователь";

  const mapEmployeeRoleToLabel = (backendRole: string): string => {
    const normalized = backendRole.trim().toUpperCase();

    if (normalized.includes("ADMIN")) {
      return "Администратор";
    }

    return "Пользователь";
  };

  const mapRoleLabelToBackend = (roleLabel: string): "COMPANY ADMIN" | "COMPANY USER" =>
    roleLabel === "Администратор" ? "COMPANY ADMIN" : "COMPANY USER";

  const mapRegistrationStatusToUi = (registrationStatus?: string): User["status"] => {
    const normalized = registrationStatus?.trim().toUpperCase();

    if (normalized === "DONE") {
      return "active";
    }

    if (normalized === "AWAIT") {
      return "awaiting";
    }

    return "blocked";
  };

  const usersError = companyStore.companyEmployeesError || companyStore.companiesListError;
  const isUsersLoading =
    companyStore.isCompanyEmployeesLoading || companyStore.isCompaniesListLoading;
  const currentUserId = auth.currentUser?.id?.trim() ?? "";
  const currentUserEmail = auth.currentUser?.email?.trim().toLowerCase() ?? "";

  const currentCompanySlug = useMemo(() => {
    const firstCompany = companyStore.companiesList[0];

    if (!firstCompany) {
      return null;
    }

    return firstCompany.slug?.trim() || firstCompany.id;
  }, [companyStore.companiesList]);

  const totalPages = Math.max(1, Math.ceil(usersStore.users.length / USERS_PER_PAGE));
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;

    return usersStore.users.slice(startIndex, endIndex);
  }, [currentPage, usersStore.users]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    void companyStore.loadCompaniesList(0);
  }, [companyStore]);

  useEffect(() => {
    if (!currentCompanySlug) {
      return;
    }

    void companyStore.loadCompanyEmployees(currentCompanySlug);
  }, [companyStore, currentCompanySlug]);

  useEffect(() => {
    if (companyStore.companyEmployees.length === 0) {
      usersStore.setUsers([]);

      return;
    }

    usersStore.setUsers(
      companyStore.companyEmployees.map((employee) => ({
        id: employee.id,
        fullName: employee.name || "Без имени",
        email: employee.email,
        role: mapEmployeeRoleToLabel(employee.role),
        status: mapRegistrationStatusToUi(employee.registrationStatus),
      })),
    );
  }, [companyStore.companyEmployees, usersStore]);

  const isSelfUser = (user: User): boolean => {
    if (currentUserId && user.id === currentUserId) {
      return true;
    }

    if (!currentUserEmail) {
      return false;
    }

    return user.email.trim().toLowerCase() === currentUserEmail;
  };

  const isEditingSelf = editingUser ? isSelfUser(editingUser) : false;
  const isRoleChangedForEdit =
    editingUser &&
    !isEditingSelf &&
    popupStore.role !== (editingUser.role === "Администратор" ? "admin" : "user");
  const isNameChangedForEdit = editingUser && popupStore.fio.trim() !== editingUser.fullName.trim();
  const isEmailChangedForEdit = editingUser && popupStore.email.trim() !== editingUser.email.trim();
  const hasRequiredFields = popupStore.fio.trim().length > 0 && popupStore.email.trim().length > 0;
  const isSubmitDisabled = editingUser
    ? !hasRequiredFields ||
      (!isNameChangedForEdit && !isEmailChangedForEdit && !isRoleChangedForEdit)
    : !hasRequiredFields || popupStore.role.trim().length === 0;

  const canEditUser = (user: User): boolean => {
    if (isSelfUser(user)) {
      return false;
    }

    return canEditAnyUser;
  };

  const canDeleteUser = (user: User): boolean => canDeleteUsers && !isSelfUser(user);

  const handleEdit = (user: User) => {
    if (!canEditUser(user)) {
      return;
    }

    setEditingUser(user);
    popupStore.setFio(user.fullName);
    popupStore.setEmail(user.email);
    popupStore.setRole(user.role === "Администратор" ? "admin" : "user");
    popupStore.open();
  };

  const handleSubmit = async () => {
    if (editingUser) {
      if (!canEditUser(editingUser)) {
        return;
      }

      if (!currentCompanySlug) {
        return;
      }

      const nextRole =
        canEditAnyUser && !isEditingSelf ? getRoleLabel(popupStore.role) : editingUser.role;
      const isUpdated = await companyStore.updateCompanyEmployeeProfile(
        currentCompanySlug,
        editingUser.id,
        {
          name: popupStore.fio,
          email: popupStore.email,
          role: mapRoleLabelToBackend(nextRole),
        },
      );

      if (!isUpdated) {
        return;
      }

      editingUser.fullName = popupStore.fio;
      editingUser.email = popupStore.email;
      editingUser.role = nextRole;
      usersStore.updateUser();
    } else {
      if (!canCreateUsers) {
        return;
      }

      if (!currentCompanySlug) {
        return;
      }

      const isCreated = await companyStore.createCompanyEmployee(currentCompanySlug, {
        name: popupStore.fio,
        email: popupStore.email,
        role: popupStore.role === "admin" ? "COMPANY ADMIN" : "COMPANY USER",
      });

      if (!isCreated) {
        return;
      }
    }

    popupStore.resetForm();
    popupStore.close();
    setEditingUser(null);
  };

  const handleCancel = () => {
    popupStore.resetForm();
    popupStore.close();
    setEditingUser(null);
  };

  const handleDelete = async (user: User) => {
    if (!currentCompanySlug || !canDeleteUser(user)) {
      return;
    }

    await companyStore.deleteCompanyEmployee(currentCompanySlug, user.id);
  };

  return (
    <>
      <TitleBar
        hideActionButton={!canCreateUsers}
        onCreateClick={() => {
          if (!canCreateUsers) {
            return;
          }

          setEditingUser(null);
          popupStore.resetForm();
          popupStore.open();
        }}
      />

      <ListOfUsers
        store={usersStore}
        users={paginatedUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canManageUsers={canEditAnyUser}
        canEditUser={canEditUser}
        canDeleteUser={canDeleteUser}
        isSelfUser={isSelfUser}
      />

      {isUsersLoading && (
        <p style={{ textAlign: "center", marginTop: 16 }}>Загрузка пользователей...</p>
      )}
      {usersError && <p style={{ textAlign: "center", marginTop: 16 }}>{usersError}</p>}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {popupStore.isOpen && (
        <div className={overlayStyles.overlay} onClick={handleCancel}>
          <div onClick={(event) => event.stopPropagation()}>
            <PopupCard
              title={editingUser ? "Редактировать пользователя" : "Добавить пользователя"}
              inputs={[
                ...(canEditAnyUser
                  ? [
                      {
                        label: "Роль*",
                        type: "select" as const,
                        placeholder: "Выберите роль",
                        value: popupStore.role,
                        onChange: popupStore.setRole,
                        disabled: isEditingSelf,
                        options: [
                          { label: "Администратор", value: "admin" },
                          { label: "Пользователь", value: "user" },
                        ],
                      },
                    ]
                  : []),
                {
                  label: "ФИО*",
                  type: "text",
                  placeholder: "Введите ФИО",
                  value: popupStore.fio,
                  onChange: popupStore.setFio,
                },
                {
                  label: "Email*",
                  type: "email",
                  placeholder: "Введите email",
                  value: popupStore.email,
                  onChange: popupStore.setEmail,
                },
              ]}
              submitText="Сохранить"
              submitDisabled={isSubmitDisabled}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </>
  );
});

export default UsersPage;
