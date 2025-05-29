// src/components/AboutUsPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users } from 'react-feather';
import TeamMemberCard from './TeamMemberCard';
// Se você tiver um logo específico para esta página, importe-o
// import logoTaskMaster from '../assets/taskmaster_logo_monochrome-nobg.png';

// Dados fictícios da equipe (substitua pelos seus dados reais)
const teamMembersData = [
    {
        id: 1,
        // Use um serviço como ui-avatars.com ou source.unsplash para placeholders se não tiver fotos
        photoUrl: `https://ui-avatars.com/api/?name=Joao+Pedro&background=D8432D&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'João Pedro Martins Montera',
        course: 'Sistemas de Informação - 5º Semestre - UFMS',
        role: 'Desenvolvedor Front-End ',
        socialLinks: {
            instagram: 'https://www.instagram.com/jotape_314/',
            linkedin: 'https://www.linkedin.com/in/jo%C3%A3o-pedro-martins-montera-35b638285/',
            github: 'https://github.com/jpmartins03',
            gmail: 'jpmartins1013@gmail.com',
            whatsapp: '5567998864911'
        }
    },
    {
        id: 2,
        photoUrl: `https://ui-avatars.com/api/?name=Helen+Yukari&background=7A1B5E&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'Helen Yukari Ohara Tochetto',
        course: 'Engenharia de Computação - 5º Semestre - UFMS',
        role: 'Desenvolvedora Back-End',
        socialLinks: {
            instagram: 'https://www.instagram.com/helenyukari_ot?igsh=MTRyMGhlenVvdnp3dw==',
            linkedin: 'https://www.linkedin.com/in/helen-yukari-0494b31a9/',
            github: 'https://github.com/Helenyukari',
            gmail: 'helenyukari1@gmail.com',
            whatsapp: '+55 67 9860-3016'
        }
    },
    {
        id: 3,
        photoUrl: `https://ui-avatars.com/api/?name=Joao+Vitor3&background=3F0C56&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'João Vitor Barbieri',
        course: 'Engenharia de Software - Estácio',
        role: 'Desenvolvedor Back-End',
        socialLinks: {
            linkedin: '#',
            github: 'https://github.com/JoaoBarbier',
            whatsapp: '5511988887777'
        }
    },
    {
        id: 4,
        photoUrl: `https://ui-avatars.com/api/?name=Membro+Equipe+3&background=3F0C56&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'Felipe',
        course: 'Engenharia de Software - Estácio',
        role: 'UI/UX Designer e Designer Gráfico',
        socialLinks: {
            linkedin: '#',
            github: 'https://github.com/felipe27-dev',
            whatsapp: '5511988887777'
        }
    },
    {
        id: 5,
        photoUrl: `https://ui-avatars.com/api/?name=Membro+Equipe+3&background=3F0C56&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'Caio',
        course: 'Engenharia de Software - Estácio',
        role: 'Desenvolvedor Back-End',
        socialLinks: {
            linkedin: '#',
            github: '',
            whatsapp: '5511988887777'
        }
    },
    {
        id: 6,
        photoUrl: `https://ui-avatars.com/api/?name=Membro+Equipe+3&background=3F0C56&color=fff&size=128&font-size=0.33&bold=true`,
        name: 'Matheus',
        course: 'Engenharia de Software - Estácio',
        role: 'Desenvolvedor Front-End',
        socialLinks: {
            linkedin: '#',
            github: 'https://github.com/ZeniMat',
            whatsapp: '5511988887777'
        }
    },
];

const AboutUsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E2A3B] via-[#101A27] to-[#0C141F] text-slate-100 p-4 sm:p-8">
            <button
                onClick={() => navigate('/')} // Volta para a LoginPage
                className="absolute left-1 top-1 p-0.5 text-slate-300 hover:text-sky-400 transition-colors"
                title="Voltar para Login"
            >
                <ArrowLeft size={28} />
            </button>
            <div className="max-w-6xl mx-auto">
                {/* Cabeçalho da Página */}
                <div className="flex items-center mb-10 relative">

                    <div className="center flex-col items-center text-center"> {/* Centraliza título e ícone */}
                        <Users size={40} className="text-pink-700 mb-2" />
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100">
                            Nossa Equipe
                        </h1>
                        <p className="text-slate-400 mt-1 text-sm">Conheça quem está por trás do TaskMaster.</p>
                    </div>
                    <div className="w-10 h-10"></div> {/* Espaçador para balancear o botão voltar */}
                </div>

                {/* Grid de Cards dos Membros */}
                {teamMembersData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
                        {teamMembersData.map(member => (
                            <TeamMemberCard
                                key={member.id}
                                photoUrl={member.photoUrl}
                                name={member.name}
                                course={member.course}
                                role={member.role}
                                socialLinks={member.socialLinks}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-400 text-lg mt-10">
                        Informações da equipe não disponíveis no momento.
                    </p>
                )}

                <div className="text-center mt-12">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-br from-[#D8432D] via-[#7A1B5E] to-[#3F0C56] text-white font-medium py-2.5 px-6 rounded-lg transition-colors hover:border-r-purple-800"
                    >
                        Voltar para a Página Inicial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;